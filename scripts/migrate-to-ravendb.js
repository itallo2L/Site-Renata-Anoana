// Migra o products.json atual pro RavenDB. Rode uma única vez, depois de
// configurar RAVENDB_URLS, RAVENDB_DATABASE e RAVENDB_CERT_BASE64 (veja o
// .env.example). Uso: node scripts/migrate-to-ravendb.js
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { getStore } = require('../api/_lib/ravendb');

const COLLECTION = 'Products';

async function main() {
  const productsPath = path.join(__dirname, '..', 'products.json');
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

  const store = getStore();
  const bulkInsert = store.bulkInsert();
  let count = 0;

  for (const product of products) {
    const { id, ...fields } = product;
    if (!id) {
      console.warn('Pulando produto sem id:', product.title);
      continue;
    }
    // O id curto vira o id do documento ("products/<id>"); não é
    // guardado como campo pra não conflitar com o controle de
    // identidade que a própria biblioteca do RavenDB faz via "id".
    await bulkInsert.store(fields, `products/${id}`, { '@collection': COLLECTION });
    count++;
  }

  await bulkInsert.finish();
  console.log(`Migração concluída: ${count} produto(s) gravado(s) no RavenDB.`);
}

main().catch((err) => {
  console.error('Erro na migração:', err);
  process.exit(1);
});
