const express = require("express");
const Participant = require("./models/Participant");
const Event = require("./models/Event");

const router = express.Router();

router.get("/", async (req, res) => {
  const events = await Event.find();
  res.render("events", { events });
});

router.get("/:eventId/register", async (req, res) => {
  const eventId = req.params.eventId;
  const event = await Event.findById(eventId);
  res.render("registration", { event });
});

router.post("/:eventId/register", async (req, res) => {
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
});

router.get("/:eventId/view", async (req, res) => {
  console.log(req.params.eventId);
  const eventId = req.params.eventId;
  const event = await Event.findById(eventId);
  const participants = await Participant.find({ eventId });

  res.render("viewParticipants", { event, participants });
});

module.exports = router;
