const crypto = require('crypto');

const COOKIE_NAME = 'renata_session';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 dias

function sign(value) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET não configurado');
  return crypto.createHmac('sha256', secret).update(value).digest('base64url');
}

function createSessionToken() {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + MAX_AGE_SECONDS * 1000 })
  ).toString('base64url');
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

function verifySessionToken(token) {
  if (!token || !token.includes('.')) return false;
  const [payload, signature] = token.split('.');

  let expected;
  try {
    expected = sign(payload);
  } catch {
    return false;
  }

  const signatureBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (signatureBuf.length !== expectedBuf.length) return false;
  if (!crypto.timingSafeEqual(signatureBuf, expectedBuf)) return false;

  let decoded;
  try {
    decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return false;
  }
  return typeof decoded.exp === 'number' && Date.now() < decoded.exp;
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  return header.split(';').reduce((acc, pair) => {
    const idx = pair.indexOf('=');
    if (idx === -1) return acc;
    const key = pair.slice(0, idx).trim();
    const value = pair.slice(idx + 1).trim();
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
}

function isAuthenticated(req) {
  const cookies = parseCookies(req);
  return verifySessionToken(cookies[COOKIE_NAME]);
}

function isLocalDevRequest(req) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(req && req.headers && req.headers.origin || '');
}

function setSessionCookie(res, req) {
  const token = createSessionToken();
  const attrs = isLocalDevRequest(req)
    ? 'HttpOnly; SameSite=Lax; Path=/'
    : 'HttpOnly; Secure; SameSite=None; Path=/';
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${token}; ${attrs}; Max-Age=${MAX_AGE_SECONDS}`);
}

function clearSessionCookie(res, req) {
  const attrs = isLocalDevRequest(req)
    ? 'HttpOnly; SameSite=Lax; Path=/'
    : 'HttpOnly; Secure; SameSite=None; Path=/';
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; ${attrs}; Max-Age=0`);
}

module.exports = { isAuthenticated, setSessionCookie, clearSessionCookie };
