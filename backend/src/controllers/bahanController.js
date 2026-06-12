import { BahanTxt } from '../models/BahanTxt.js';

export const getAll = async (req, res, next) => {
  try {
    const bahanList = await BahanTxt.findAll();
    res.json(bahanList);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bahan = await BahanTxt.findById(id);

    if (!bahan) {
      return res.status(404).json({ message: 'Bahan not found' });
    }

    res.json(bahan);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { filename, content } = req.body;

    if (!filename || !content) {
      return res.status(400).json({ message: 'Filename and content required' });
    }

    const bahan = await BahanTxt.create(filename, content, req.user.id);
    res.status(201).json(bahan);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { filename, content } = req.body;

    if (!filename || !content) {
      return res.status(400).json({ message: 'Filename and content required' });
    }

    const bahan = await BahanTxt.update(id, filename, content);

    if (!bahan) {
      return res.status(404).json({ message: 'Bahan not found' });
    }

    res.json(bahan);
  } catch (error) {
    next(error);
  }
};

export const deleteOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bahan = await BahanTxt.delete(id);

    if (!bahan) {
      return res.status(404).json({ message: 'Bahan not found' });
    }

    res.json({ message: 'Bahan deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const bulkUpload = async (req, res, next) => {
  try {
    const { bahanArray } = req.body;

    if (!Array.isArray(bahanArray) || bahanArray.length === 0) {
      return res.status(400).json({ message: 'Bahan array is required' });
    }

    const bahanWithUser = bahanArray.map(item => ({
      ...item,
      uploadedBy: req.user.id,
    }));

    const results = await BahanTxt.bulkCreate(bahanWithUser);
    res.status(201).json({
      message: `${results.length} bahan uploaded successfully`,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

export const bulkDelete = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'IDs array is required' });
    }

    const results = await BahanTxt.bulkDelete(ids);
    res.json({
      message: `${results.length} bahan deleted successfully`,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};
