/**
 * Role-based Access Control Middleware
 * Restricts access to specific roles
 * 
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'user')
 * @returns {Function} Express middleware
 */
function roleMiddleware(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak: Autentikasi diperlukan'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak: Hanya Admin yang dapat melakukan aksi ini.'
      });
    }

    next();
  };
}

module.exports = roleMiddleware;
