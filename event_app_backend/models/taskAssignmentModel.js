import mongoose from 'mongoose';

const taskAssignmentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

// Compound index to ensure user-task pairs are unique
taskAssignmentSchema.index({ user: 1, task: 1 }, { unique: true });

const TaskAssignment = mongoose.model("TaskAssignment", taskAssignmentSchema);
export default TaskAssignment;