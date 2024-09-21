const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  fullName: {
    type: String,
    required: [true, "full name not provided "],
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, "email not provided "],
    trim: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "{VALUE} is not a valid email!",
    },
  },
  dateOfBirth: {
    type: Date,
    required: [true, "date of birth not provided "],
  },
  heardAbout: {
    type: String,
    required: [true, "heardAbout not provided "],
  },
});

module.exports = mongoose.model("Participant", participantSchema);
