var pool = require("./MysqlPool");
var roomName = require("./EmailCompareAndRoomName");

const getRoomId = room => {
  let sql = `SELECT id FROM  rooms WHERE  room=?`;
  return pool
    .query(sql, [room])
    .then(result => result[0].id)
    .catch(err => console.log(err));
};

const createPrivateRoom = (email1, email2) => {
  let room = roomName(email1, email2);

  return getRoomId(room).then(id => {
    if (!id) {
      let sql = `INSERT INTO rooms(room) VALUES(?)`;
      return pool
        .query(sql, [room])
        .then(result => room)
        .catch(err => console.log(err));
    } else return room;
  });
};

const isUser = (email, passwordHash) => {
  let sql = `SELECT email  FROM  users WHERE email=? AND passwordHash=?`;

  pool
    .query(sql, [email, passwordHash])
    .then(resultUserFind => {
      if (resultUserFind.length) return true;
      else return false;
    })
    .catch(errorUserFind => console.log(errorUserFind));
};

const createUser = (email, passwordHash) => {
  let sql = `INSERT INTO users(email,passwordHash) VALUES(?,?)`;
  pool
    .query(sql, [email, passwordHash])
    .then(result => {
      return true;
    })
    .catch(err => {
      return false;
    });
};

module.exports = { isUser, createUser, getRoomId, createPrivateRoom };
