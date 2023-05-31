import express from "express";
import {} from "express-async-errors";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { config } from "../config.js";
import { db } from "../db/database.js";

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ message: errors.array()[0].msg });
};

//회원가입시 유효성 검사
const validateSignup = [
  body("password").trim().isLength({ min: 5 }).withMessage("비밀번호는 6글자 이상"),
  body("name").notEmpty().withMessage("이름 작성 필수"),
  body("email").isEmail().normalizeEmail().withMessage("유효하지 않은 이메일"),
  validate,
];

async function signup(req, res) {
  const { username, password, name, email } = req.body;
  //기존 존재하는 회원인지 확인필요
  const found = await db
    .execute("SELECT * FROM user WHERE username=?", [username])
    .then((result) => result[0][0]);

  if (found) {
    return res.status(409).json({ message: `${username}은 이미 존재하는 이름입니다.` });
  }
  //비밀번호 암호화
  const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);

  //db에 생성
  const userId = db
    .execute("INSERT INTO user (username, password, name, email) VALUES (?,?,?,?)", [
      username,
      hashed,
      name,
      email,
    ])
    .then((res) => res[0].insertId);
  //return 해줄 토큰
  const token = jwt.sign({ userId }, config.jwt.secretKey);
  res.status(201).json({ token, username });
}

router.post("/signup", validateSignup, signup);

export default router;
