import express from 'express';
// import { protect, admin } from '../middlewares/authMiddleware.js';
import {
 addAttendee,
 getAttendeesForEvent,
 deleteAttendee,
} from '../controllers/attendeeController.js';

const router = express.Router();

router.post('/:eventId', addAttendee);
router.get('/event/:eventId', getAttendeesForEvent);
router.delete('/:eventId/:attendeeId', deleteAttendee);

export default router;