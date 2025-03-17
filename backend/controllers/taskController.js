const Task = require('../models/taskModel');
const mongoose = require('mongoose');

// Get all tasks for a user
const getTasks = async (req, res) => {
  const user_id = req.user._id;

  try {
    const tasks = await Task.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single task
const getTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such task' });
  }

  const task = await Task.findById(id);

  if (!task) {
    return res.status(404).json({ error: 'No such task' });
  }
  
  // Check if the task belongs to the user
  if (task.user_id !== req.user._id.toString()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.status(200).json(task);
};

// Create new task
const createTask = async (req, res) => {
  const { title, description, status } = req.body;

  let emptyFields = [];

  if (!title) {
    emptyFields.push('title');
  }
  if (!description) {
    emptyFields.push('description');
  }
  if (!status) {
    emptyFields.push('status');
  }
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields });
  }

  // Add doc to db
  try {
    const user_id = req.user._id;
    const task = await Task.create({ title, description, status, user_id });
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such task' });
  }

  const task = await Task.findById(id);

  if (!task) {
    return res.status(404).json({ error: 'No such task' });
  }
  
  // Check if the task belongs to the user
  if (task.user_id !== req.user._id.toString()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const deletedTask = await Task.findOneAndDelete({ _id: id });

  res.status(200).json(deletedTask);
};

// Update a task
const updateTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such task' });
  }

  const task = await Task.findById(id);

  if (!task) {
    return res.status(404).json({ error: 'No such task' });
  }
  
  // Check if the task belongs to the user
  if (task.user_id !== req.user._id.toString()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const updatedTask = await Task.findOneAndUpdate({ _id: id }, {
    ...req.body
  }, { new: true });

  res.status(200).json(updatedTask);
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  deleteTask,
  updateTask
};