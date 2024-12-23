import express from 'express';
import {
  getTaskAssignments,
  addTaskAssignment,
  updateTaskAssignment,
  deleteTaskAssignment,
  getTaskAssignmentsByUser
} from '../controllers/taskAssignmentController.js';

const router = express.Router();

router.get('/task/:taskId', getTaskAssignments);
router.get('/user/:userId', getTaskAssignmentsByUser);
router.post('/task/:taskId', addTaskAssignment);
router.patch('/:taskId/:userId', updateTaskAssignment);
router.delete('/:taskId/:userId', deleteTaskAssignment);

export default router;