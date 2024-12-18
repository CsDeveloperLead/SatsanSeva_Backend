import express from "express";
import { addEvent, getEventById, deleteEvent, getUpComingEvents, getPastEvents, updateEvent, getLatestEvents } from "../controllers/event-controller.js";
const eventsRouter = express.Router();
eventsRouter.get("/", getUpComingEvents);
eventsRouter.get("/past", getPastEvents);
eventsRouter.get("/latest",getLatestEvents)
eventsRouter.get("/:id", getEventById);
eventsRouter.put("/:id", updateEvent);
eventsRouter.post("/", addEvent);
eventsRouter.delete("/:id", deleteEvent);

export default eventsRouter;
