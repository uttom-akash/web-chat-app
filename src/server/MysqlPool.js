var mysql = require("mysql");
var promisify = require("util.promisify");

var pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "akash",
  database: "mydb",
  connectionLimit: 10
});

pool.query = promisify(pool.query);

module.exports = pool;
