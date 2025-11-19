const schema= UserResponseSchema;
export const validateBody = (schema) => {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body); // ← Zod parse
      next();
    } catch (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors?.map((e) => e.message) || [error.message],
      });
    }
  };
};

export const validateParams = (schema) => {
  return (req, res, next) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors?.map((d) => d.message) || [error.message],
      });
    }
  };
};