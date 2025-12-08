export const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const { isAdmin, isInstructor, isStudent } = req.user;
      const roleMap = {
        admin:isAdmin,
        instructor: isInstructor,
        student: isStudent,
      }
      const isAllowed = allowedRoles.some(role => roleMap[role] === true );

      if (!isAllowed) {
        return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
      }
      next();
    };
  };