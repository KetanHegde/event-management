import Task from '../models/taskModel.js';

// Create a Task
export const createTask = async (req, res) => {
  const { name, deadline, event } = req.body;

  try {
    const task = new Task({
      name,
      deadline,
      event,
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Tasks for an Event
export const getTasksForEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const tasks = await Task.find({ event: eventId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Use deleteOne or deleteMany depending on your need
    await Task.deleteOne({ _id: id });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
