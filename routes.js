const express = require("express");
const Participant = require("./models/Participant");
const Event = require("./models/Event");

const router = express.Router();

/**
 * Retrieves all events from the database and renders the "events" view 
 * with the events sorted by the specified criteria.
 *
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 *
 * @returns {void}
 */
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 16;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "title";
    let sortCriteria = {};

    if (sortBy === "title") {
      sortCriteria = { name: 1 };
    } else if (sortBy === "date") {
      sortCriteria = { date: 1 };
    } else if (sortBy === "organizer") {
      sortCriteria = { organizer: 1 };
    }

    const totalEvents = await Event.countDocuments();
    const events = await Event.find().limit(limit).skip(skip).sort(sortCriteria);
    const totalPages = Math.ceil(totalEvents / limit);
    res.render("events", {
      events,
      currentPage: page,
      totalPages,
      sortBy,
    });
  } catch (err) {
    res.status(500).send("Error retrieving events");
  }
});

/**
 * Renders the registration page correponding to the specific event.
 *
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 *
 * @returns {void}
 */
router.get("/:eventId/register", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = await Event.findById(eventId);
    res.render("registration", { event });
  } catch (err) {
    res.status(500).send("Error accessing register");
  }
});

/**
 * Handles POST request to register a participant for an event.
 *
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 *
 * @returns {void}
 */
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

/**
 * Retrieves all participants for a specific event and renders the "viewParticipants" view
 * with the ability to search by full name or email.
 *
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 *
 * @returns {void}
 */
router.get("/:eventId/view", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = await Event.findById(eventId);

    const searchQuery = req.query.q || "";

    const searchCriteria = {
      eventId,
      $or: [
        { fullName: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ],
    };

    const participants = await Participant.find(
      searchQuery ? searchCriteria : { eventId }
    );

    res.render("viewParticipants", { event, participants, searchQuery });
  } catch (err) {
    res.status(500).send("Error retrieving participants");
  }
});

module.exports = router;
