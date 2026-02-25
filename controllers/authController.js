const User = require('../models/User')
const { generateToken } = require('../middleware/auth')

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const user = await User.create({ name, email, password })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      })
    } else {
      res.status(401).json({ message: 'Invalid email or password' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      })
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}