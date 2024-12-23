import TaskAssignment from '../models/taskAssignmentModel.js';
import Task from '../models/taskModel.js';
import User from '../models/userModel.js';

// Get all task assignments for a specific task
export const getTaskAssignments = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const assignments = await TaskAssignment.find({ task: taskId }).populate('user task');
    
    if (!assignments) {
      return res.status(404).json({ message: 'No task assignments found for this task.' });
    }
    
    res.status(200).json(assignments);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving task assignments', error: err.message });
  }
};

// Get all task assignments for a specific user
export const getTaskAssignmentsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const assignments = await TaskAssignment.find({ user: userId }).populate('user task');
    
    if (!assignments) {
      return res.status(404).json({ message: 'No task assignments found for this user.' });
    }
    
    res.status(200).json(assignments);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving task assignments for user', error: err.message });
  }
};

// Add a task assignment to a user
export const addTaskAssignment = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { userId, status } = req.body;

    // Check if task and user exist
    const task = await Task.findById(taskId);
    const user = await User.findById(userId);

    if (!task || !user) {
      return res.status(404).json({ message: 'Task or user not found.' });
    }

    // Create a new task assignment
    const newAssignment = new TaskAssignment({
      user: userId,
      task: taskId,
      status: status || 'pending',
    });

    await newAssignment.save();
    res.status(201).json({ message: 'Task assignment created successfully', assignment: newAssignment });
  } catch (err) {
    res.status(500).json({ message: 'Error creating task assignment', error: err.message });
  }
};

// Update the status of a task assignment
export const updateTaskAssignment = async (req, res) => {
  try {
    const { taskId, userId } = req.params;
    const { status } = req.body;

    // Validate if status is valid
    if (!['pending', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. It must be "pending" or "completed".' });
    }

    // Update the task assignment
    const assignment = await TaskAssignment.findOneAndUpdate(
      { task: taskId, user: userId },
      { status },
      { new: true }
    );

    if (!assignment) {
      return res.status(404).json({ message: 'Task assignment not found.' });
    }

    res.status(200).json({ message: 'Task assignment updated successfully', assignment });
  } catch (err) {
    res.status(500).json({ message: 'Error updating task assignment', error: err.message });
  }
};

// Delete a task assignment
export const deleteTaskAssignment = async (req, res) => {
  try {
    const { taskId, userId } = req.params;

    const assignment = await TaskAssignment.findOneAndDelete({ task: taskId, user: userId });

    if (!assignment) {
      return res.status(404).json({ message: 'Task assignment not found.' });
    }

    res.status(200).json({ message: 'Task assignment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task assignment', error: err.message });
  }
};
