const { getFile } = require('./_lib/github');

const PRODUCTS_PATH = 'products.json';

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
    const { content } = await getFile(PRODUCTS_PATH);
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(JSON.parse(content));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Não foi possível carregar o catálogo' });
  }
};
