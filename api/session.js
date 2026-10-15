const { isAuthenticated } = require('./_lib/auth');
const { applyCors, handlePreflight } = require('./_lib/cors');

module.exports = (req, res) => {
  applyCors(req, res);
  if (handlePreflight(req, res)) return;

  res.status(200).json({ authenticated: isAuthenticated(req) });
};
