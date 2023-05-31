import express from "express";
import { validationResult } from "express-validator";

const router = express.Router();

//회원가입시 유효성 검사
const validateSignup = [
  ...validateCredential,
  body("name").notEmpty().withMessage("이름 작성 필수"),
  body("email").isEmail().normalizeEmail().withMessage("유효하지 않은 이메일"),
  validate,
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ message: errors.array()[0].msg });
};

export default router;
