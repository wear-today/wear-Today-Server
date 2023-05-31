import mysql from "mysql2";
import { config } from "../config.js";

//createPool을 통해 mysql 서버에 접속가능
const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  database: config.db.database,
  password: config.db.password,
});

//비동기적으로 사용하길 원하니까 비동기버전을 export
export const db = pool.promise();
