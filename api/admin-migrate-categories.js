// Endpoint temporário, só pra rodar uma vez em produção a migração que cria
// a coleção "Categories" no RavenDB (equivalente a
// scripts/migrate-categories-to-ravendb.js, que só dá pra rodar localmente
// contra bancos cujas credenciais a gente tem em mãos — as de produção são
// "Sensitive" na Vercel e não dá pra ler de fora). Protegido por sessão de
// admin. Remover este arquivo (e fazer deploy de novo) depois de usado.
const { isAuthenticated } = require('./_lib/auth');
const { openSession } = require('./_lib/ravendb');
const { applyCors, handlePreflight } = require('./_lib/cors');

const KNOWN_LABELS = {
  colares: 'Colares', aneis: 'Anéis', pulseiras: 'Pulseiras',
  braceletes: 'Braceletes', brincos: 'Brincos', conjuntos: 'Conjuntos',
  pingentes: 'Pingentes',
};

function labelFor(slug) {
  if (KNOWN_LABELS[slug]) return KNOWN_LABELS[slug];
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

module.exports = async (req, res) => {
  applyCors(req, res);
  if (handlePreflight(req, res)) return;

  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Não autenticado' });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const session = openSession();

    const products = await session.advanced.loadStartingWith('products/', { pageSize: 1024 });
    const usedSlugs = new Set(products.map((p) => p.category).filter(Boolean));
    const slugs = new Set([...Object.keys(KNOWN_LABELS), ...usedSlugs]);

    const created = [];
    const skipped = [];
    for (const slug of slugs) {
      const id = `categories/${slug}`;
      const existing = await session.load(id);
      if (existing) {
        skipped.push(slug);
        continue;
      }
      const doc = { label: labelFor(slug) };
      await session.store(doc, id);
      session.advanced.getMetadataFor(doc)['@collection'] = 'Categories';
      created.push(slug);
    }

    await session.saveChanges();
    return res.status(200).json({ ok: true, created, skipped });
  } catch (err) {
    console.error(err);
    return res.status(err.status || 500).json({ error: err.message || 'Erro interno' });
  }
};
