const Task = require('../models/Task')

// Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body

    if (!title) {
      return res.status(400).json({ message: 'Title is required' })
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'pending',
      user: req.user._id
    })

    res.status(201).json(task)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get All Tasks (with pagination)
exports.getTasks = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query
    const query = { user: req.user._id }

    if (status) query.status = status

    const limitNum = parseInt(limit, 10)
    const pageNum = parseInt(page, 10)

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Task.countDocuments(query)
    ])

    res.json({
      tasks,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get Single Task
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id })

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' })
    }

    res.json(task)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status } = req.body

    if (status && !['pending', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, description, status },
      { new: true, runValidators: true } // Returns the updated document
    )

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' })
    }

    res.json(task)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id })

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' })
    }

    res.json({ message: 'Task removed' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}