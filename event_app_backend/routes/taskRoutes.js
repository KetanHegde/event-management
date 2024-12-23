import express from 'express';
import {
  createTask,
  getTasksForEvent,
  getAllTasks,
  deleteTask,
} from '../controllers/taskController.js';

const router = express.Router();

// Task Routes
router.get('/', getAllTasks);
router.post('/', createTask);  // Create Task
router.get('/event/:eventId',  getTasksForEvent);  // Get Tasks for Event
router.delete('/:id', deleteTask);
export default router;
