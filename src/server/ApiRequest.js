var express = require("express");
var pool = require("./MysqlPool");
var roomName = require("./EmailCompareAndRoomName");
var fs = require("fs");
var multer = require("multer");
var path = require("path");
var filedir = require("./FileDirect");
// var bodyParser=require('body-parser');

// var urlencodedParser = bodyParser.urlencoded({ extended: false });

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, filedir(file.mimetype));
  },
  filename: function(req, file, cb) {
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

  dbGetRoomId(receiver, sender).then(roomId => {
    let sql = `INSERT INTO uploads(roomId,fileName,mimeType,path,date) VALUES(?,?,?,?,?)`;
    const path = `http://192.168.0.110:8080/api/download?q=${filedir(
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

  dbGetRoomId(receiver, sender).then(roomId => {
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

router.get("/vdo", function(req, res) {
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
  const {
    file,
    message,
    receiver,
    sender,
    fileName,
    type,
    messageType,
    date
  } = req.body.data;

  dbGetRoomId(receiver, sender).then(roomId => {
    let sql = `INSERT INTO messages(roomId,message,sender,fileName,mimeType,messageType,date,seen) 
    VALUES(?,?,?,?,?,?,?,?)`;
    pool
      .query(sql, [
        roomId,
        message,
        sender,
        fileName,
        type,
        messageType,
        date,
        false
      ])
      .then(resultMes => {
        res.json({ status: "succes" });
        if (messageType) {
          fs.createWriteStream(`${filedir(type)}/${fileName}`).write(
            new Buffer(file.split(",")[1], "base64")
          );
        }
      })
      .catch(err => res.status(400).json({ status: "failed" }));
  });
});

//Getting messages

// const getRes = resMes => {
//   let resultMessages = resMes.map(async item => {
//     if (item.messageType) {
//       fs.readFile(`${filedir(item.type)}/${item.fileName}`, (err, data) => {
//         item.file = data;
//       });
//     } else {
//       item.file = "";
//     }

//     return item;
//   });
//   console.log(resultMessages);
//   return resultMessages;
// };

router.post("/get-message", (req, res) => {
  const { receiver, sender } = req.body.data;

  dbGetRoomId(receiver, sender).then(roomId => {
    let sql = `SELECT message,sender,fileName,mimeType,messageType,date,seen FROM messages WHERE roomId=? ORDER BY id DESC  LIMIT 1`;
    pool
      .query(sql, [roomId])
      .then(resultMes => {
        const resultMessages = resultMes.map(item => {
          item.file = "";
          if (item.messageType) {
            const content = fs.readFileSync(
              `${filedir(item.type)}/${item.fileName}`,
              { encoding: "base64" }
            );
            item.file = `data:${item.type};base64,${content}`;
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
    .query(sql, [userName, userEmail, password, true, "2019-2-11"])
    .then(dbresult => {
      fs.createWriteStream(
        `./src/server/uploads/profile/${userEmail}.jpg`
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
    .query(sql, [userEmail, password])
    .then(dbresult => {
      const { userName, active, date } = dbresult[0];
      res.json({
        userName,
        userEmail,
        active,
        date,
        profilePicture: `data:image/jpg;base64,${getProfilePicture(userEmail)}`
      });
    })
    .catch(err => console.log(err));
});

router.post("/current-user", (req, res) => {
  const { userEmail } = req.body.data;
  const sql = `SELECT userName,active,date FROM users WHERE userEmail=?`;

  pool
    .query(sql, [userEmail])
    .then(dbresult => {
      const { userName, active, date } = dbresult[0];
      res.json({
        userName,
        userEmail,
        active,
        date,
        profilePicture: `data:image/jpg;base64,${getProfilePicture(userEmail)}`
      });
    })
    .catch(err => res.status(400).json({ error: "user not found" }));
});

router.post("/get-friends", (req, res) => {
  const { userEmail } = req.body.data;

  //get my uid
  dbGetUid(userEmail).then(uid => {
    console.log("mine : ", uid);

    //get friends uid
    dbGetFriendsUid(uid).then(friendsUidList => {
      let friendsInfoList = friendsUidList.map(
        ({ secondId: friendUid, roomId }) =>
          dbGetProfileInfo(friendUid).then(profileinfo =>
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
});

const dbGetlastMessage = roomId => {
  let sql = `SELECT message,messageType,date,seen FROM messages WHERE roomId=? ORDER BY id DESC  LIMIT 1`;
  return pool
    .query(sql, [roomId])
    .then(resultMes => {
      let item = {};
      item.message = "";
      item.date = "";
      if (resultMes.length) {
        item = resultMes[0];
        if (item.messageType) {
          item.message = "media file";
        }
      }
      return item;
    })
    .catch(err => console.log(err));
};

const dbGetRoomId = (receiver, sender) => {
  const room = roomName(receiver, sender);

  let sql = `SELECT id FROM rooms WHERE room=?`;
  return pool
    .query(sql, [room])
    .then(dbresult => dbresult[0].id)
    .catch(dberr => console.log(dberr));
};

const dbGetUid = userEmail => {
  let sql = `SELECT uid FROM users WHERE userEmail=?`;
  return pool.query(sql, [userEmail]).then(dbresult => dbresult[0].uid);
};

const dbGetFriendsUid = uid => {
  let sql = `SELECT secondId,roomId FROM friends WHERE firstId=? LIMIT 5`;
  return pool.query(sql, [uid]);
};

const dbGetProfileInfo = uid => {
  let sql = `SELECT userName,userEmail FROM users WHERE uid=?`;
  return pool.query(sql, [uid]).then(dbresult => {
    return {
      userName: dbresult[0].userName,
      userEmail: dbresult[0].userEmail,
      profilePicture: `data:image/jpg;base64,${getProfilePicture(
        dbresult[0].userEmail
      )}`
    };
  });
};

const getProfilePicture = userEmail =>
  fs.readFileSync(`./src/server/uploads/profile/${userEmail}.jpg`, "base64");

module.exports = router;
