/**
 * Middleware: adminOnly
 * Must be used AFTER the `protect` middleware.
 * Blocks access with 403 if the logged-in user is not an admin.
 */
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied: Admins only" });
};
