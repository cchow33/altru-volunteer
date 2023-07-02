import express from "express";
import {
  getNgos,
  getNgo,
  getFiltered,
  updateVolunteerCount,
  createNgo,
  createEvent,
  editEvent,
  editNgo,
} from "../controllers/ngoController.js";

const router = express.Router();

router.get("/", getNgos);
router.post("/", createNgo);
router.get("/:id", getNgo);
router.put("/:id", editNgo);
router.post("/:id/event", createEvent);
router.put("/:id/event", editEvent);
router.put("/:id/decrement", updateVolunteerCount);
router.get("/:frequency/:category", getFiltered);

export default router;
