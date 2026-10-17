const { isAuthenticated } = require('./_lib/auth');
const { getFile, putFile, toPublicImageUrl } = require('./_lib/github');
const { openSession } = require('./_lib/ravendb');
const { applyCors, handlePreflight } = require('./_lib/cors');

const COLLECTION = 'Products';
const ID_PREFIX = 'products/';

function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// O id curto (ex: "teste-mv9x18wi") é derivado do id do documento no
// RavenDB ("products/teste-mv9x18wi"). Não é guardado como campo dentro
// do documento porque a própria biblioteca do RavenDB usa a propriedade
// "id" da entidade pra controlar a identidade do documento internamente
// — guardar nosso id curto ali conflita com esse controle.
function docId(id) {
  return `products/${id}`;
}

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

async function saveImage(productId, imageDataUrl) {
  const match = /^data:image\/(\w+);base64,(.+)$/.exec(imageDataUrl);
  if (!match) throw new Error('Formato de imagem inválido');
  const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
  const base64 = match[2];
  const path = `images/produtos/${productId}.${ext}`;

  let sha;
  try {
    const existing = await getFile(path);
    sha = existing.sha;
  } catch (err) {
    if (err.status !== 404) throw err;
  }

  const result = await putFile({
    path,
    content: base64,
    isBase64: true,
    sha,
    message: `Atualiza imagem de ${productId}`,
  });
  return { path, version: result.content.sha };
}

function normalizePrice(value, fallback) {
  if (value === '' || value === undefined || value === null) return fallback ?? null;
  const num = Number(value);
  return Number.isNaN(num) ? fallback ?? null : num;
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
      // reflete a última escrita na hora — session.query() passa por um
      // índice automático que atualiza de forma assíncrona e pode responder
      // com dados de alguns segundos atrás logo depois de salvar um produto.
      const entities = await session.advanced.loadStartingWith(ID_PREFIX, { pageSize: 1024 });
      return res.status(200).json(entities.map(toApiShape));
    }

    if (req.method === 'POST') {
      const { product, image } = req.body || {};
      if (!product || !product.title) {
        return res.status(400).json({ error: 'Produto inválido: título é obrigatório' });
      }
      const id = product.id || `${slugify(product.title)}-${Date.now().toString(36)}`;
      const existing = await session.load(docId(id));
      if (existing) {
        return res.status(409).json({ error: 'Já existe um produto com esse id' });
      }

      let imagePath = product.image || '';
      let imageVersion;
      if (image) ({ path: imagePath, version: imageVersion } = await saveImage(id, image));

      const doc = {
        title: product.title,
        description: product.description || '',
        material: product.material || '',
        category: product.category || '',
        price: normalizePrice(product.price, null),
        image: imagePath,
        imageVersion: imageVersion || null,
        size: product.size || null,
      };
      await session.store(doc, docId(id));
      session.advanced.getMetadataFor(doc)['@collection'] = COLLECTION;
      await session.saveChanges();
      return res.status(201).json(toApiShape(doc));
    }

    if (req.method === 'PUT') {
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: 'id é obrigatório' });

      const { product, image } = req.body || {};
      if (!product) return res.status(400).json({ error: 'Dados do produto são obrigatórios' });

      const existing = await session.load(docId(id));
      if (!existing) return res.status(404).json({ error: 'Produto não encontrado' });

      let imagePath = product.image ?? existing.image;
      let imageVersion = existing.imageVersion;
      if (image) ({ path: imagePath, version: imageVersion } = await saveImage(id, image));

      const { id: _ignoreId, ...fields } = product;
      Object.assign(existing, fields, {
        image: imagePath,
        imageVersion,
        price: normalizePrice(product.price, existing.price),
      });
      await session.saveChanges();
      return res.status(200).json(toApiShape(existing));
    }

    if (req.method === 'DELETE') {
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: 'id é obrigatório' });

      const existing = await session.load(docId(id));
      if (!existing) return res.status(404).json({ error: 'Produto não encontrado' });

      session.delete(existing);
      await session.saveChanges();
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET, POST, PUT, DELETE');
    return res.status(405).json({ error: 'Método não permitido' });
  } catch (err) {
    console.error(err);
    return res.status(err.status || 500).json({ error: err.message || 'Erro interno' });
  }
};
