var fs = require("fs");
var pool = require("./MysqlPool");
var roomName = require("./EmailCompareAndRoomName");
var filedir = require("./FileDirect");
var type = require("./FileType");

const dbUpdateMessageStatus = (
  senderEmail,
  receiverEmail,
  dateTime,
  status
) => {
  let query = `UPDATE messages SET status=? WHERE receiverEmail=? AND roomId=? AND status!=? AND date<=CAST(? AS DATETIME)`;
  dbGetRoomId(roomName(senderEmail, receiverEmail)).then(roomId =>
    pool.query(query, [status, receiverEmail, roomId, "seen", dateTime])
  );
};

const dbSaveMessage = data => {
  let {
    file,
    message,
    receiverEmail,
    senderEmail,
    fileName,
    mimeType,
    messageType,
    date,
    status
  } = data;

  const room = roomName(receiverEmail, senderEmail);

  return dbGetRoomId(room).then(roomId => {
    let sql = `INSERT INTO messages(roomId,message,senderEmail,receiverEmail,fileName,mimeType,messageType,date,status) 
    VALUES(?,?,?,?,?,?,?,?,?)`;

    if (messageType && type(mimeType) === "files") {
      message = `https://192.168.0.110:8080/api/download?q=${filedir(
        mimeType
      )}/${fileName}`;
    }

    console.log(message);

    return pool
      .query(sql, [
        roomId,
        message,
        senderEmail,
        receiverEmail,
        fileName,
        mimeType,
        messageType,
        date,
        status
      ])
      .then(resultMes => {
        if (messageType) {
          fs.createWriteStream(`${filedir(mimeType)}/${fileName}`).write(
            new Buffer(file.split(",")[1], "base64")
          );
        }
        return { status: "delievred" };
      })
      .catch(err => ({ status: "failed" }));
  });
};

const dbMakeRoom = room => {
  return dbGetRoomId(room).then(roomId => {
    if (roomId) {
      return roomId;
    } else {
      let sql = `INSERT INTO rooms(room) VALUES(?)`;
      return pool.query(sql, [room]).then(dbresult => dbresult.insertId);
    }
  });
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

const dbGetRoomId = room => {
  let sql = `SELECT id FROM rooms WHERE room=?`;
  return pool
    .query(sql, [room])
    .then(dbresult => {
      if (dbresult.length) return dbresult[0].id;
      else return 0;
    })
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
  let sql = `SELECT userName,userEmail,active FROM users WHERE userEmail=?`;
  return pool.query(sql, [userEmail]).then(dbresult => {
    return {
      userName: dbresult[0].userName,
      userEmail: dbresult[0].userEmail,
      active: dbresult[0].active,
      profilePicture: `data:image/jpeg;base64,${getProfilePicture(
        dbresult[0].userEmail
      )}`
    };
  });
};

const getProfilePicture = userEmail =>
  fs.readFileSync(`./src/server/uploads/profile/${userEmail}.jpeg`, "base64");

const dbUpdateUsers = (userEmail, options) => {
  const query = `UPDATE users SET active=? WHERE userEmail=?`;
  pool.query(query, [options, userEmail]);
};

module.exports = {
  dbUpdateMessageStatus,
  dbSaveMessage,
  dbMakeRoom,
  dbGetlastMessage,
  dbGetRoomId,
  dbGetUid,
  dbGetFriendEmail,
  dbGetProfileInfo,
  getProfilePicture,
  dbUpdateUsers
};
