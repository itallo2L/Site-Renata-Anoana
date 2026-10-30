const { openSession } = require('./_lib/ravendb');
const { toPublicImageUrl } = require('./_lib/github');

const ID_PREFIX = 'products/';

function shortId(ravenDocId) {
  return ravenDocId.replace(/^products\//, '');
}

function toApiShape(entity) {
  return {
    id: shortId(entity.id),
    title: entity.title,
    description: entity.description,
    material: entity.material,
    category: entity.category,
    price: entity.price,
    image: toPublicImageUrl(entity.image, entity.imageVersion),
    size: entity.size,
  };
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const session = openSession();
    // loadStartingWith lê direto do storage (sem passar por índice), então
    // reflete a última escrita na hora — session.query() passa por um índice
    // automático que atualiza de forma assíncrona e pode responder com dados
    // de alguns segundos atrás logo depois de salvar um produto.
    const entities = await session.advanced.loadStartingWith(ID_PREFIX, { pageSize: 1024 });
    const published = entities.filter((e) => e.status !== 'draft');
    published.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(published.map(toApiShape));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Não foi possível carregar o catálogo' });
  }
};
