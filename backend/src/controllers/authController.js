import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await User.verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const newUser = await User.create(username, password, role || 'user');

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: newUser,
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Username already exists' });
    }
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};
