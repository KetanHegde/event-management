import express from 'express';
// import { protect, admin } from '../middlewares/authMiddleware.js';
import {
  createTask,
  getTasksForEvent,
  updateTaskStatus,
} from '../controllers/taskController.js';

const router = express.Router();

// Task Routes
router.post('/', createTask);  // Create Task
router.get('/event/:eventId',  getTasksForEvent);  // Get Tasks for Event
router.put('/:id/status', updateTaskStatus);  // Update Task Status

export default router;
