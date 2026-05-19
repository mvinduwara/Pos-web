export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    // Return a 400 Bad Request if validation fails
    res.status(400).json({
      status: 'fail',
      message: 'Validation Error',
      errors: error.errors.map(err => ({ field: err.path[0], message: err.message }))
    });
  }
};