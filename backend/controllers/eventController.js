import Event from "../models/Event.js";

export const getEvents = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    const events = await Event.find(filter).sort({ date: 1 });
    res.json({ success: true, count: events.length, events });
  } catch (error) {
    console.error("❌ Failed to fetch events:", error?.message || error);
    res.status(200).json({ success: true, count: 0, events: [] });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.json({ success: true, event });
  } catch (error) {
    console.error("❌ Failed to fetch event:", error?.message || error);
    res.status(500).json({ success: false, message: "Failed to fetch event" });
  }
};

export const createEvent = async (req, res) => {
  try {
    if (req.accountType !== "company" || !req.companyData?._id) {
      return res.status(403).json({ success: false, message: "Only company accounts can create events" });
    }
    const { title, date, location, description } = req.body;
    if (!title || !date || !location) {
      return res
        .status(400)
        .json({ success: false, message: "Title, date and location are required" });
    }
    const event = await Event.create({
      title,
      date,
      location,
      description: description || "",
    });
    res.status(201).json({ success: true, message: "Event created", event });
  } catch {
    res.status(500).json({ success: false, message: "Failed to create event" });
  }
};

export const updateEvent = async (req, res) => {
  try {
    if (req.accountType !== "company" || !req.companyData?._id) {
      return res.status(403).json({ success: false, message: "Only company accounts can update events" });
    }
    const { id } = req.params;
    const update = req.body || {};
    const event = await Event.findByIdAndUpdate(id, update, { new: true });
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    res.json({ success: true, message: "Event updated", event });
  } catch {
    res.status(500).json({ success: false, message: "Failed to update event" });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    if (req.accountType !== "company" || !req.companyData?._id) {
      return res.status(403).json({ success: false, message: "Only company accounts can delete events" });
    }
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    res.json({ success: true, message: "Event deleted" });
  } catch {
    res.status(500).json({ success: false, message: "Failed to delete event" });
  }
};
