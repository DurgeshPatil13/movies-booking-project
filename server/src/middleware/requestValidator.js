/**
 * Request parameter validation utilities
 */
export const validateParamId = (paramName = 'id') => {
  return (req, res, next) => {
    const value = req.params[paramName];
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid or missing parameter: :${paramName}`
      });
    }
    next();
  };
};
