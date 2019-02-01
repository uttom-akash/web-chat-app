var express = require("express");
var pool = require("./MysqlPool");
var roomName = require("./EmailCompareAndRoomName");

var multer = require("multer");

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

router.post("/photo", uploads.single("image"), (req, res) => {
  console.log(req);
  res.json({});
});

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
