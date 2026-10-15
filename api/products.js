const { isAuthenticated } = require('./_lib/auth');
const { getFile, putFile } = require('./_lib/github');

const PRODUCTS_PATH = 'products.json';

function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function readProducts() {
  const { content, sha } = await getFile(PRODUCTS_PATH);
  return { products: JSON.parse(content), sha };
}

async function writeProducts(products, sha, message) {
  const content = JSON.stringify(products, null, 2) + '\n';
  return putFile({ path: PRODUCTS_PATH, content, message, sha });
}

async function saveImage(productId, imageDataUrl) {
  const match = /^data:image\/(\w+);base64,(.+)$/.exec(imageDataUrl);
  if (!match) throw new Error('Formato de imagem inválido');
  const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
  const base64 = match[2];
  const path = `images/produtos/${productId}.${ext}`;
  await putFile({
    path,
    content: base64,
    isBase64: true,
    message: `Atualiza imagem de ${productId}`,
  });
  return path;
}

function normalizePrice(value, fallback) {
  if (value === '' || value === undefined || value === null) return fallback ?? null;
  const num = Number(value);
  return Number.isNaN(num) ? fallback ?? null : num;
}

module.exports = async (req, res) => {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  try {
    if (req.method === 'GET') {
      const { products } = await readProducts();
      return res.status(200).json(products);
    }

    if (req.method === 'POST') {
      const { product, image } = req.body || {};
      if (!product || !product.title) {
        return res.status(400).json({ error: 'Produto inválido: título é obrigatório' });
      }
      const { products, sha } = await readProducts();
      const id = product.id || `${slugify(product.title)}-${Date.now().toString(36)}`;
      if (products.some((p) => p.id === id)) {
        return res.status(409).json({ error: 'Já existe um produto com esse id' });
      }

      let imagePath = product.image || '';
      if (image) imagePath = await saveImage(id, image);

      const newProduct = {
        id,
        title: product.title,
        description: product.description || '',
        material: product.material || '',
        category: product.category || '',
        price: normalizePrice(product.price, null),
        image: imagePath,
        size: product.size || null,
      };
      products.push(newProduct);
      await writeProducts(products, sha, `Adiciona produto ${newProduct.title}`);
      return res.status(201).json(newProduct);
    }

    if (req.method === 'PUT') {
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: 'id é obrigatório' });

      const { product, image } = req.body || {};
      if (!product) return res.status(400).json({ error: 'Dados do produto são obrigatórios' });

      const { products, sha } = await readProducts();
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) return res.status(404).json({ error: 'Produto não encontrado' });

      let imagePath = product.image ?? products[index].image;
      if (image) imagePath = await saveImage(id, image);

      products[index] = {
        ...products[index],
        ...product,
        id,
        image: imagePath,
        price: normalizePrice(product.price, products[index].price),
      };
      await writeProducts(products, sha, `Atualiza produto ${products[index].title}`);
      return res.status(200).json(products[index]);
    }

    if (req.method === 'DELETE') {
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: 'id é obrigatório' });

      const { products, sha } = await readProducts();
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) return res.status(404).json({ error: 'Produto não encontrado' });

      const [removed] = products.splice(index, 1);
      await writeProducts(products, sha, `Remove produto ${removed.title}`);
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET, POST, PUT, DELETE');
    return res.status(405).json({ error: 'Método não permitido' });
  } catch (err) {
    console.error(err);
    return res.status(err.status || 500).json({ error: err.message || 'Erro interno' });
  }
};
