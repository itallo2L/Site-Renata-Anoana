const { clearSessionCookie } = require('./_lib/auth');
const { applyCors, handlePreflight } = require('./_lib/cors');

module.exports = (req, res) => {
  applyCors(req, res);
  if (handlePreflight(req, res)) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido' });
  }
  clearSessionCookie(res, req);
  res.status(200).json({ ok: true });
};
