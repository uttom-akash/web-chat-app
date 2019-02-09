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

  const { receiver, sender } = req.body;
  const { originalname, mimetype } = req.file;
  const room = roomName(receiver, sender);

  let sql = `SELECT id FROM rooms WHERE room=?`;

  pool
    .query(sql, [room])
    .then(result => {
      //saving message messages table
      const id = result[0].id;

      if (id) {
        let sql = `INSERT INTO uploads(roomId,fileName,mimeType,path) VALUES(?,?,?,?)`;
        const path = `http://192.168.0.110:8080/api/download?q=${filedir(
          mimetype
        )}/${originalname}`;

        pool
          .query(sql, [id, originalname, mimetype, path])
          .then(resultMes => res.json({ status: "succes" }))
          .catch(err => res.status(400).json({ status: "failed" }));
      }
    })
    .catch(uploadErr => console.log(uploadErr));
});

router.post("/download-list", (req, res) => {
  const { sender, receiver } = req.body.data;
  const room = roomName(sender, receiver);

  let sql = `SELECT id FROM rooms WHERE room=?`;

  pool
    .query(sql, [room])
    .then(result => {
      const id = result[0].id;

      if (id) {
        let sql = `SELECT fileName,mimeType,path FROM uploads WHERE roomId=? ORDER BY id DESC LIMIT 10`;

        pool
          .query(sql, [id])
          .then(downloadResult => res.json({ downloadResult }))
          .catch(err => res.status(400).json({ status: "failed" }));
      }
    })
    .catch(downloadErr => console.log(downloadErr));
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

  console.log(date);

  const room = roomName(receiver, sender);

  //finding room id from  rooms table
  let sql = `SELECT id FROM rooms WHERE room=?`;
  pool
    .query(sql, [room])
    .then(result => {
      //saving message messages table
      const id = result[0].id;

      if (id) {
        sql = `INSERT INTO messages(roomId,message,sender,fileName,type,messageType,date) 
        VALUES(?,?,?,?,?,?,?)`;
        pool
          .query(sql, [
            result[0].id,
            message,
            sender,
            fileName,
            type,
            messageType,
            date
          ])
          .then(resultMes => {
            res.json({ status: "succes" });
            fs.createWriteStream(`${filedir(type)}/${fileName}`).write(
              new Buffer(file.split(",")[1], "base64")
            );
          })
          .catch(err => res.status(400).json({ status: "failed" }));
      }
    })
    .catch(error => console.log(error));
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
  const room = roomName(receiver, sender);

  //checking if there is chat room
  let sql = `SELECT id FROM rooms WHERE room=?`;
  pool
    .query(sql, [room])
    .then(result => {
      //geting message from messages table
      if (result[0].id) {
        sql = `SELECT message,sender,fileName,type,messageType,date FROM messages WHERE roomId=? ORDER BY id DESC  LIMIT 1`;
        pool
          .query(sql, [result[0].id])
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
      }
    })
    .catch(error => console.log(error));
});
module.exports = router;
