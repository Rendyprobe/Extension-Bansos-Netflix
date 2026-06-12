export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Validation errors
  if (err.message && err.message.includes('validation')) {
    return res.status(400).json({
      message: err.message,
      errors: err.errors || [],
    });
  }

  // Database errors
  if (err.code === 'ECONNREFUSED') {
    return res.status(500).json({ message: 'Database connection failed' });
  }

  if (err.code === '23505') {
    // Unique violation
    return res.status(400).json({ message: 'Resource already exists' });
  }

  // Default error
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
};
