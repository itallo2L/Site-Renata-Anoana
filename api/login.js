const bcrypt = require('bcryptjs');
const { setSessionCookie } = require('./_lib/auth');
const { applyCors, handlePreflight } = require('./_lib/cors');

module.exports = async (req, res) => {
  applyCors(req, res);
  if (handlePreflight(req, res)) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD_HASH não configurado no servidor' });
  }

  const { password } = req.body || {};
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Senha é obrigatória' });
  }

  const valid = await bcrypt.compare(password, hash);
  if (!valid) {
    return res.status(401).json({ error: 'Senha incorreta' });
  }

  setSessionCookie(res, req);
  res.status(200).json({ ok: true });
};
