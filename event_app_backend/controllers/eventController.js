import Event from '../models/eventModel.js';

// Create Event
export const createEvent = async (req, res) => {
  const { name, description, location, date, attendees } = req.body;
  try {
    const event = new Event({
      name,
      description,
      location,
      date,
      attendees: attendees || [], // Ensure attendees defaults to an empty array
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Event
export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { name, description, location, date, attendees } = req.body;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.name = name || event.name;
    event.description = description || event.description;
    event.location = location || event.location;
    event.date = date || event.date;
    event.attendees = attendees || event.attendees;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Event
export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Use deleteOne or deleteMany depending on your need
    await Event.deleteOne({ _id: id });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

