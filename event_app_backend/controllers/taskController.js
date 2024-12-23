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
    const tasks = await Task.find({ event: eventId }).populate('assignedAttendee', 'username email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Task Status
export const updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure only the assigned attendee can update the task status
    if (task.assignedAttendee.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this task' });
    }

    task.status = status;
    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
