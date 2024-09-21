const express = require("express");
const Participant = require("./models/Participant");
const Event = require("./models/Event");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 16;
    const skip = (page - 1) * limit;
    const totalEvents = await Event.countDocuments();
    const events = await Event.find().limit(limit).skip(skip);
    const totalPages = Math.ceil(totalEvents / limit);
    res.render("events", {
      events,
      currentPage: page,
      totalPages,
    });
  } catch (err) {
    res.status(500).send("Error retrieving events");
  }
});

router.get("/:eventId/register", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = await Event.findById(eventId);
    res.render("registration", { event });
  } catch (err) {
    res.status(500).send("Error accessing register");
  }
});

router.post("/:eventId/register", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { fullName, email, dateOfBirth, heardAbout } = req.body;

    const participant = new Participant({
      eventId,
      fullName,
      email,
      dateOfBirth: new Date(dateOfBirth),
      heardAbout,
    });

    await participant.save();
    res.redirect(`/${eventId}/view`);
  } catch (err) {
    res.status(500).send("Error inserting data");
  }
});

router.get("/:eventId/view", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = await Event.findById(eventId);
    const participants = await Participant.find({ eventId });

    res.render("viewParticipants", { event, participants });
  } catch (err) {
    res.status(500).send("Error retrieving participants");
  }
});

module.exports = router;
