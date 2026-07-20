const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const target = req[source];
      const parsed = schema.parse(target);
      // Replace original request field with validated/sanitized parse output
      req[source] = parsed;
      next();
    } catch (error) {
      if (error.errors) {
        // Format Zod errors
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message
        }));
        return res.status(400).json({
          success: false,
          message: formattedErrors[0]?.message || 'Validation failed',
          error: formattedErrors[0]?.message || 'Validation failed',
          errors: formattedErrors
        });
      }
      next(error);
    }
  };
};

module.exports = { validate };
