const { clearSessionCookie } = require('./_lib/auth');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido' });
  }
  clearSessionCookie(res);
  res.status(200).json({ ok: true });
};
