import express from "express";
import "express-async-errors";
import { body } from "express-validator";
import { validate } from "../middleware/vlidator.js";
import { db } from "../db/database.js";

const router = express.Router();

const validatePost = [
  body("text").trim().isLength({ min: 3 }).withMessage("text should be at least 3 charcaters"),
  validate,
];

async function getById(id) {
  return db
    .execute(
      "SELECT pt.id, pt.text, pt.createdAt, pt.userId, us.username, us.name FROM posts as pt JOIN user as us ON pt.userId=us.id WHERE pt.id=?",
      [id]
    )
    .then((result) => result[0][0]);
}

async function createPost(req, res) {
  const { text, userId } = req.body;
  const date = new Date();
  const post = await db
    .execute("INSERT INTO posts (text, createdAt, userId) VALUES(?,?,?)", [text, date, userId])
    .then((result) => getById(result[0].insertId));
  res.status(201).json(post);
}

//POST /posts
router.post("/", validatePost, createPost);

export default router;
