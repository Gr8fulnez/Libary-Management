import express from "express";
import { auth } from "../middleware/auth";

const router = express.Router();

import {
  createbook,
  getbook,
  getSinglebook,
  getDeleteSinglebook,
  updatebook,
  deletebook,
} from "../controller/bookController";

router.post("/create", auth, createbook);
router.get("/read", getbook);
router.get("", getbook);
router.get("/read/:id", getSinglebook);
router.post("/update/:id", auth, updatebook);
router.get("/readdelete/:id", auth, getDeleteSinglebook);
router.post("/delete/:id", auth, deletebook);

export default router;
