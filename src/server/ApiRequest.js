var express = require("express");
var pool = require("./MysqlPool");
var roomName = require("./EmailCompareAndRoomName");
var fs = require("fs");
var multer = require("multer");
var path = require("path");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/images");
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

router.post("/file", uploads.single("file"), (req, res) => {
  res.json({});
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

// router.get("/", function(req, res, next) {
//   let path1 = path.join(__dirname, "test.mp4");
//   fs.stat(path1, function(err, stats) {
//     if (err) {
//       if (err.code === "ENOENT") {
//         console.log(err, __dirname);

//         return res.sendStatus(404);
//       }
//       return next(err);
//     }

//     let range = req.headers.range;
//     let file_size = stats.size;
//     console.log("size : ", stats.size);

//     if (!range) {
//       res.writeHead(200, {
//         "Content-Length": file_size,
//         "Content-Type": "video/mp4"
//       });
//     } else {
//       let positions = range.replace(/bytes=/, "").split("-");
//       let start = parseInt(positions[0], 10);

//       let end = positions[1] ? parseInt(positions[1], 10) : file_size - 1;
//       let chunksize = end - start + 1;
//       console.log("chunk", chunksize);

//       if (chunksize > 1024 * 1024) {
//         chunksize = 1024 * 1024;
//         end = start + chunksize - 1;
//       }

//       console.log("chunk2: ", chunksize, start, end);

//       let head = {
//         "Content-Range": `bytes ${start}-${end}/${file_size}`,
//         "Accept-Ranges": "bytes",
//         "Content-Length": chunksize,
//         "Content-Type": "video/mp4"
//       };
//       res.writeHead(206, head);

//       let stream_position = {
//         start: start,
//         end: end
//       };
//       let stream = fs.createReadStream(path1, stream_position);
//       stream.on("open", function() {
//         stream.pipe(res);
//       });
//       stream.on("error", function(err) {
//         return next(err);
//       });
//     }
//   });
// });
router.post("/save-message", (req, res) => {
  const { message, to, sender, filename } = req.body.data;
  const room = roomName(to, sender);

  //finding room id from  rooms table
  let sql = `SELECT id FROM rooms WHERE room=?`;
  pool
    .query(sql, [room])
    .then(result => {
      //saving message messages table
      const id = result[0].id;

      if (id) {
        sql = `INSERT INTO messages(roomId,message,sender) VALUES(?,?,?)`;
        pool
          .query(sql, [result[0].id, message, sender])
          .then(resultMes => res.json({ status: "succes" }))
          .catch(err => res.status(400).json({ status: "failed" }));
      }
    })
    .catch(error => console.log(error));
});

//Getting messages

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
        sql = `SELECT message,sender FROM messages WHERE roomId=? ORDER BY id DESC  LIMIT 5`;
        pool
          .query(sql, [result[0].id])
          .then(resultMes => res.json({ messages: resultMes }))
          .catch(err => res.status(400).json({ status: "failed" }));
      }
    })
    .catch(error => console.log(error));
});
module.exports = router;
