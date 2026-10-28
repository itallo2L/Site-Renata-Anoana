// Cria a coleção "Categories" no RavenDB: uma categoria passa a existir por
// si só (documento próprio), em vez de "existir" só enquanto algum produto
// usa o slug dela. Semeia as 7 categorias originais do site e qualquer outra
// categoria que já esteja em uso por um produto mas ainda não tenha
// documento próprio. Rode uma única vez por banco (dev e, depois, produção),
// com as variáveis do .env.example configuradas. Uso:
// node scripts/migrate-categories-to-ravendb.js
require('dotenv').config();

const { getStore } = require('../api/_lib/ravendb');

const KNOWN_LABELS = {
  colares: 'Colares', aneis: 'Anéis', pulseiras: 'Pulseiras',
  braceletes: 'Braceletes', brincos: 'Brincos', conjuntos: 'Conjuntos',
  pingentes: 'Pingentes',
};

function labelFor(slug) {
  if (KNOWN_LABELS[slug]) return KNOWN_LABELS[slug];
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

async function main() {
  const store = getStore();
  const session = store.openSession();

  const products = await session.advanced.loadStartingWith('products/', { pageSize: 1024 });
  const usedSlugs = new Set(products.map((p) => p.category).filter(Boolean));

  const slugs = new Set([...Object.keys(KNOWN_LABELS), ...usedSlugs]);

  let created = 0;
  for (const slug of slugs) {
    const id = `categories/${slug}`;
    const existing = await session.load(id);
    if (existing) {
      console.log(`Já existe: ${slug}`);
      continue;
    }
    const doc = { label: labelFor(slug) };
    await session.store(doc, id);
    session.advanced.getMetadataFor(doc)['@collection'] = 'Categories';
    console.log(`Criando: ${slug} -> ${doc.label}`);
    created++;
  }

  await session.saveChanges();
  console.log(`Migração concluída: ${created} categoria(s) criada(s).`);
}

main().catch((err) => {
  console.error('Erro na migração:', err);
  process.exit(1);
});
