var express = require("express");
var pool = require("./MysqlPool");
var roomName = require("./EmailCompareAndRoomName");
var multer = require("multer");
var fs = require("fs");
var path = require("path");
var filedir = require("./FileDirect");
var getSha256 = require("./Hashing");

var {
  dbSaveMessage,
  dbMakeRoom,
  dbGetlastMessage,
  dbGetRoomId,
  dbGetFriendEmail,
  dbGetProfileInfo,
  getProfilePicture,
  dbUpdateUsers
} = require("./QueryMethod");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, filedir(file.mimetype));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  cb(null, true);
};

const uploads = multer({ storage, fileFilter });

const router = express.Router();

router.post("/upload", uploads.single("file"), (req, res) => {
  console.log(req.body);

  const { receiver, sender, date } = req.body;
  const { originalname, mimetype } = req.file;

  dbGetRoomId(roomName(receiver, sender)).then(roomId => {
    let sql = `INSERT INTO uploads(roomId,fileName,mimeType,path,date) VALUES(?,?,?,?,?)`;
    const path = `https://192.168.0.110:8080/api/download?q=${filedir(
      mimetype
    )}/${originalname}`;

    pool
      .query(sql, [roomId, originalname, mimetype, path, date])
      .then(resultMes => res.json({ status: "succes" }))
      .catch(err => res.status(400).json({ status: "failed" }));
  });
});

router.post("/download-list", (req, res) => {
  const { sender, receiver } = req.body.data;

  dbGetRoomId(roomName(receiver, sender)).then(roomId => {
    let sql = `SELECT fileName,mimeType,path,date FROM uploads WHERE roomId=? ORDER BY id DESC LIMIT 10`;

    pool
      .query(sql, [roomId])
      .then(downloadResult => res.json({ downloadResult }))
      .catch(err => res.status(400).json({ status: "failed" }));
  });
});

router.get("/download", (req, res) => {
  const dirName = req.query.q;
  res.download(dirName);
});

router.get("/vdo", function (req, res) {
  let file = path.join(__dirname, "uploads/images", `${req.query.q}`);

  fs.stat(file, (err, stats) => {
    if (err) {
      console.log(err);
      throw new Error(err);
    }
    console.log("size : ", stats.size);

    let range = req.headers.range;

    if (range) {
      let position = range.replace(/bytes=/, "").split("-");
      let start = parseInt(position[0], 10);
      let fileSize = stats.size;
      let end = position[1] ? parseInt(position[1], 10) : fileSize - 1;

      let chunksize = end - start + 1;
      const defaultSize = 1024 * 1024;

      if (chunksize > defaultSize) {
        chunksize = defaultSize;
        end = start + chunksize - 1;
      }

      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4"
      };

      res.writeHead(206, head);
      let stream = fs.createReadStream(file, { start, end });
      stream.on("open", () => {
        stream.pipe(res);
      });
      stream.on("error", err => {
        throw new Error(err);
      });
    }
  });
});

router.post("/save-message", (req, res) => {
  dbSaveMessage(req.body.data).then(dbresult => res.json(dbresult));
});

router.post("/get-message", (req, res) => {
  const { receiver, sender } = req.body.data;
  dbGetRoomId(roomName(receiver, sender)).then(roomId => {
    let sql = `SELECT message,senderEmail,receiverEmail,fileName,mimeType,messageType,date,status FROM messages WHERE roomId=? ORDER BY id DESC  LIMIT 4`;
    pool
      .query(sql, [roomId])
      .then(resultMes => {
        const resultMessages = resultMes.map(item => {
          item.file = "";
          if (item.messageType) {
            const content = fs.readFileSync(
              `${filedir(item.mimeType)}/${item.fileName}`,
              { encoding: "base64" }
            );
            item.file = `data:${item.mimeType};base64,${content}`;
          }
          return item;
        });

        res.json({ messages: resultMessages });
      })
      .catch(err => res.status(400).json({ status: "failed" }));
  });
});

router.post("/register", (req, res) => {
  const { userName, userEmail, password, profilePicture } = req.body.data;

  const sql = `INSERT INTO users(userName, userEmail, passwordHash,active,date) VALUES(?,?,?,?,?)`;
  pool
    .query(sql, [userName, userEmail, getSha256(password), true, "2019-2-11"])
    .then(dbresult => {
      fs.createWriteStream(
        `./src/server/uploads/profile/${userEmail}.jpeg`
      ).write(new Buffer(profilePicture.split(",")[1], "base64"));
      res.json({
        userName,
        userEmail,
        profilePicture
      });
    })
    .catch(dberror =>
      res.status(400).json({ error: "email is already in use" })
    );
});

router.post("/login", (req, res) => {
  const { userEmail, password } = req.body.data;
  let sql = `SELECT userName,active,date FROM users WHERE userEmail=? AND passwordHash=?`;

  pool
    .query(sql, [userEmail, getSha256(password)])
    .then(dbresult => {
      console.log("log :-> ", dbresult);

      if (dbresult.length) {
        const { userName, active, date } = dbresult[0];
        res.json({
          userName,
          userEmail,
          active,
          date,
          profilePicture: `data:image/jpeg;base64,${getProfilePicture(
            userEmail
          )}`
        });
        dbUpdateUsers(userEmail, 1);
      } else {
        res.status(400).json({ error: "Credentials is not valid" });
      }
    })
    .catch(err => console.log(err));
});

router.post("/current-user", (req, res) => {
  const { userEmail } = req.body.data;
  const sql = `SELECT userName,active,date FROM users WHERE userEmail=?`;

  pool
    .query(sql, [userEmail])
    .then(dbresult => {
      if (dbresult.length) {
        const { userName, active, date } = dbresult[0];
        res.json({
          userName,
          userEmail,
          active,
          date,
          profilePicture: `data:image/jpeg;base64,${getProfilePicture(
            userEmail
          )}`
        });
      } else {
        res.status(400).json({ error: "user not found" });
      }
    })
    .catch(err => res.status(400).json({ error: "user not found" }));
});

router.post("/logOut", (req, res) => {
  const { userEmail } = req.body.data;
  dbUpdateUsers(userEmail, 0);
});

router.post("/get-friends", (req, res) => {
  const { userEmail } = req.body.data;
  // dbUpdateUsers(userEmail);
  dbGetFriendEmail(userEmail).then(friendsEmailList => {
    let friendsInfoList = friendsEmailList.map(
      ({ secondEmail: friendEmail, roomId }) =>
        dbGetProfileInfo(friendEmail).then(profileinfo =>
          dbGetlastMessage(roomId, 1).then(messages => {
            return {
              profile: profileinfo,
              messages
            };
          })
        )
    );

    Promise.all(friendsInfoList).then(Friendlist => res.json({ Friendlist }));
  });
});

router.post("/search", (req, res) => {
  const { firstEmail, query } = req.body.data;
  let sql = `SELECT userName,userEmail,active FROM users WHERE userName REGEXP ? LIMIT 7`;

  pool.query(sql, [`^${query}`]).then(dbresult => {
    let peoplesPromises = dbresult.map(people => {
      const { userName, userEmail, active } = people;
      sql = `SELECT EXISTS(SELECT * FROM friends WHERE firstEmail=? AND secondEmail=?) AS isFriend`;
      return pool
        .query(sql, [firstEmail, userEmail])
        .then(dbresult2 => {
          return {
            userName,
            userEmail,
            active,
            isFriend: dbresult2[0].isFriend,
            profilePicture: `data:image/jpeg;base64,${getProfilePicture(
              people.userEmail
            )}`
          };
        })
        .catch(dberr => console.log(dberr));
    });
    Promise.all(peoplesPromises).then(peoples => res.json({ peoples }));
  });
});
router.post("/add-friend", (req, res) => {
  const { friendEmail, myEmail, date } = req.body.data;
  const room = roomName(friendEmail, myEmail);
  dbMakeRoom(room).then(roomId => {
    let sql = `INSERT INTO friends(firstEmail,secondEmail,roomId,date) VALUES(?,?,?,?)`;
    pool
      .query(sql, [myEmail, friendEmail, roomId, date])
      .then(dbresult => res.json({ status: true }))
      .catch(dbresult => res.json({ status: false }));
  });
});

router.post("/unfriend", (req, res) => {
  const { firstEmail, secondEmail } = req.body.data;
  const room = roomName(firstEmail, secondEmail);
  let sql = `DELETE  FROM  rooms WHERE room=?;`;

  pool
    .query(sql, [room])
    .then(dbresult => res.json({}))
    .catch(dberr => res.json({}));
});

module.exports = router;
