var fs = require("fs");
var pool = require("./MysqlPool");
var roomName = require("./EmailCompareAndRoomName");
// var roomName = require("./EmailCompareAndRoomName");
// var multer = require("multer");
// var path = require("path");
var filedir = require("./FileDirect");
// var mysql = require("mysql");

const dbUpdateMessageStatus = (senderEmail, receiverEmail, dateTime) => {
  let query = `UPDATE messages SET status=? WHERE receiverEmail=? AND roomId=? AND  date<=CAST(? AS DATETIME)`;
  dbGetRoomId(senderEmail, receiverEmail).then(roomId =>
    pool.query(query, ["seen", receiverEmail, roomId, dateTime])
  );
};

const dbSaveMessage = data => {
  const {
    file,
    message,
    receiverEmail,
    senderEmail,
    fileName,
    type,
    messageType,
    date
  } = data;

  return dbGetRoomId(receiverEmail, senderEmail).then(roomId => {
    let sql = `INSERT INTO messages(roomId,message,senderEmail,receiverEmail,fileName,mimeType,messageType,date,status) 
    VALUES(?,?,?,?,?,?,?,?,?)`;
    return pool
      .query(sql, [
        roomId,
        message,
        senderEmail,
        receiverEmail,
        fileName,
        type,
        messageType,
        date,
        "delivered"
      ])
      .then(resultMes => {
        if (messageType) {
          fs.createWriteStream(`${filedir(type)}/${fileName}`).write(
            new Buffer(file.split(",")[1], "base64")
          );
        }
        return { status: "delievred" };
      })
      .catch(err => ({ status: "failed" }));
  });
};

const dbMakeRoom = room => {
  let sql = `INSERT INTO rooms(room) VALUES(?)`;
  return pool.query(sql, [room]).then(dbresult => dbresult.insertId);
};

const dbGetlastMessage = roomId => {
  let sql = `SELECT message,messageType,date,status,senderEmail FROM messages WHERE roomId=? ORDER BY id DESC  LIMIT 1`;
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

const dbGetFriendEmail = userEmail => {
  let sql = `SELECT secondEmail,roomId FROM friends WHERE firstEmail=? LIMIT 5`;
  return pool.query(sql, [userEmail]);
};

const dbGetProfileInfo = userEmail => {
  let sql = `SELECT userName,userEmail FROM users WHERE userEmail=?`;
  return pool.query(sql, [userEmail]).then(dbresult => {
    return {
      userName: dbresult[0].userName,
      userEmail: dbresult[0].userEmail,
      profilePicture: `data:image/jpeg;base64,${getProfilePicture(
        dbresult[0].userEmail
      )}`
    };
  });
};

const getProfilePicture = userEmail =>
  fs.readFileSync(`./src/server/uploads/profile/${userEmail}.jpeg`, "base64");

module.exports = {
  dbUpdateMessageStatus,
  dbSaveMessage,
  dbMakeRoom,
  dbGetlastMessage,
  dbGetRoomId,
  dbGetUid,
  dbGetFriendEmail,
  dbGetProfileInfo,
  getProfilePicture
};
