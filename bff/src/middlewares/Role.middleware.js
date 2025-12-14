export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { isAdmin, isInstructor, isStudent, role, status } = req.user;

    const roleMap = {
      admin: isAdmin,
      instructor: isInstructor,
      student: isStudent,
    };

    const isAllowed = allowedRoles.some(r => roleMap[r] === true);

    if (!isAllowed) {
      return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
    }

    // Extra check: only active instructors can access instructor routes
    if (role === 'instructor' && status !== 'active') {
      return res.status(403).json({ error: 'Instructor account not approved' });
    }
    next();
  };
};
