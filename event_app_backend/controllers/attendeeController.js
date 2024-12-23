import Event from '../models/eventModel.js';
import User from '../models/userModel.js';

const addAttendee = async (req, res) => {
  const { eventId } = req.params;
  const { attendeeIds } = req.body;  // Now expecting an array of attendee IDs

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Loop through the attendeeIds to add each attendee
    for (const attendeeId of attendeeIds) {
      const user = await User.findById(attendeeId);
      if (!user) return res.status(404).json({ message: `User with ID ${attendeeId} not found` });

      // Only add the attendee if not already in the event's attendee list
      if (!event.attendees.includes(attendeeId)) {
        event.attendees.push(attendeeId);
      }
    }

    await event.save();
    res.json({ message: 'Attendees added successfully', event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAttendeesForEvent = async (req, res) => {
 try {
   const event = await Event.findById(req.params.eventId).populate('attendees', 'username email');
   if (!event) return res.status(404).json({ message: 'Event not found' });
   res.json(event.attendees);
 } catch (error) {
   res.status(500).json({ message: error.message });
 }
};

const deleteAttendee = async (req, res) => {
 const { eventId, attendeeId } = req.params;

 try {
   const event = await Event.findById(eventId);
   if (!event) return res.status(404).json({ message: 'Event not found' });

   event.attendees = event.attendees.filter(attendee => attendee.toString() !== attendeeId);
   await event.save();

   res.json({ message: 'Attendee removed successfully' });
 } catch (error) {
   res.status(500).json({ message: error.message });
 }
};

export { addAttendee, getAttendeesForEvent, deleteAttendee };