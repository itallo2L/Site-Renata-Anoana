// Migra o products.json atual pro RavenDB. Rode uma única vez, depois de
// configurar RAVENDB_URLS, RAVENDB_DATABASE e RAVENDB_CERT_BASE64 (veja o
// .env.example). Uso: node scripts/migrate-to-ravendb.js
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { openSession } = require('../api/_lib/ravendb');

async function main() {
  const productsPath = path.join(__dirname, '..', 'products.json');
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

  const session = openSession();
  let count = 0;

  for (const product of products) {
    const id = product.id;
    if (!id) {
      console.warn('Pulando produto sem id:', product.title);
      continue;
    }
    const existing = await session.load(`products/${id}`);
    if (existing) {
      console.log(`Já existe, pulando: ${id}`);
      continue;
    }
    await session.store(product, `products/${id}`);
    count++;
  }

  await session.saveChanges();
  console.log(`Migração concluída: ${count} produto(s) gravado(s) no RavenDB.`);
}

main().catch((err) => {
  console.error('Erro na migração:', err);
  process.exit(1);
});
