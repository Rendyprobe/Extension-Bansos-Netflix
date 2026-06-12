import { User } from '../models/User.js';

export const getAll = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id == req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const result = await User.delete(id);

    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
