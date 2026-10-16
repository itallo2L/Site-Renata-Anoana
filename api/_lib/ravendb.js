const { DocumentStore } = require('ravendb');

let storeInstance;

function getStore() {
  if (storeInstance) return storeInstance;

  const urls = (process.env.RAVENDB_URLS || '').split(',').map((s) => s.trim()).filter(Boolean);
  const database = process.env.RAVENDB_DATABASE;
  const certBase64 = process.env.RAVENDB_CERT_BASE64;
  const certPassword = process.env.RAVENDB_CERT_PASSWORD || '';

  if (!urls.length || !database || !certBase64) {
    throw new Error('RAVENDB_URLS, RAVENDB_DATABASE e RAVENDB_CERT_BASE64 precisam estar configurados');
  }

  const store = new DocumentStore(urls, database, {
    type: 'pfx',
    certificate: Buffer.from(certBase64, 'base64'),
    password: certPassword,
  });
  store.initialize();

  storeInstance = store;
  return storeInstance;
}

function openSession() {
  return getStore().openSession();
}

module.exports = { getStore, openSession };
