const { openSession } = require('./_lib/ravendb');
const { toPublicImageUrl } = require('./_lib/github');

const COLLECTION = 'Products';

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
    const entities = await session.query({ collection: COLLECTION }).all();
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(entities.map(toApiShape));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Não foi possível carregar o catálogo' });
  }
};
