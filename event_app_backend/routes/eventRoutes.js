import express from 'express';
// import { protect, admin } from '../middlewares/authMiddleware.js';
import {
  createEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';

const router = express.Router();

router.post('/', createEvent);  
router.get('/',  getAllEvents); 
router.put('/:id', updateEvent);  
router.delete('/:id',deleteEvent); 

export default router;
