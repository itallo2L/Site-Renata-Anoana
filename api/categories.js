const { isAuthenticated } = require('./_lib/auth');
const { openSession } = require('./_lib/ravendb');
const { applyCors, handlePreflight } = require('./_lib/cors');

const COLLECTION = 'Categories';
const ID_PREFIX = 'categories/';

function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function docId(slug) {
  return `${ID_PREFIX}${slug}`;
}

function shortId(ravenDocId) {
  return ravenDocId.slice(ID_PREFIX.length);
}

function toApiShape(entity) {
  return { slug: shortId(entity.id), label: entity.label };
}

module.exports = async (req, res) => {
  applyCors(req, res);
  if (handlePreflight(req, res)) return;

  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const session = openSession();

  try {
    if (req.method === 'GET') {
      // loadStartingWith lê direto do storage (sem passar por índice), então
      // reflete a última escrita na hora — ver o mesmo comentário em products.js.
      const entities = await session.advanced.loadStartingWith(ID_PREFIX, { pageSize: 1024 });
      const categories = entities.map(toApiShape)
        .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));
      return res.status(200).json(categories);
    }

    if (req.method === 'POST') {
      const { label } = req.body || {};
      const trimmed = (label || '').toString().trim();
      if (!trimmed) return res.status(400).json({ error: 'Nome da categoria é obrigatório' });

      const slug = slugify(trimmed);
      if (!slug) return res.status(400).json({ error: 'Nome da categoria inválido' });

      const existing = await session.load(docId(slug));
      if (existing) {
        return res.status(409).json({ error: 'Já existe uma categoria com esse nome' });
      }

      const doc = { label: trimmed };
      await session.store(doc, docId(slug));
      session.advanced.getMetadataFor(doc)['@collection'] = COLLECTION;
      await session.saveChanges();
      return res.status(201).json(toApiShape(doc));
    }

    if (req.method === 'DELETE') {
      const slug = req.query.slug;
      if (!slug) return res.status(400).json({ error: 'slug é obrigatório' });

      const existing = await session.load(docId(slug));
      if (!existing) return res.status(404).json({ error: 'Categoria não encontrada' });

      session.delete(existing);
      await session.saveChanges();
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'Método não permitido' });
  } catch (err) {
    console.error(err);
    return res.status(err.status || 500).json({ error: err.message || 'Erro interno' });
  }
};
