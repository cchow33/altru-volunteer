import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ngo",
  },
  name: {
    type: String,
  },
  location: {
    type: String,
  },
  num_volunteers: {
    type: Number,
  },
  volunteer_duties: {
    type: String,
  },
  date: {
    type: String,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  description: {
    type: String,
  },
  volunteers: [
    {
      type: String,
      ref: "User",
    },
  ],
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
