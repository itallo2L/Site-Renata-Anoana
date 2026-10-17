const API_BASE = 'https://api.github.com';

function getConfig() {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const token = process.env.GITHUB_TOKEN;
  if (!owner || !repo || !token) {
    throw new Error('GITHUB_OWNER, GITHUB_REPO e GITHUB_TOKEN precisam estar configurados');
  }
  return { owner, repo, branch, token };
}

async function githubRequest(path, options = {}) {
  const { token } = getConfig();
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    const body = await response.text();
    const error = new Error(`GitHub API ${response.status}: ${body}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

async function getFile(path) {
  const { owner, repo, branch } = getConfig();
  const data = await githubRequest(
    `/repos/${owner}/${repo}/contents/${path}?ref=${branch}`
  );
  const content = Buffer.from(data.content, 'base64').toString('utf8');
  return { content, sha: data.sha };
}

async function putFile({ path, content, message, sha, isBase64 = false }) {
  const { branch, owner, repo } = getConfig();
  const encoded = isBase64 ? content : Buffer.from(content, 'utf8').toString('base64');
  const body = {
    message,
    content: encoded,
    branch,
    committer: { name: 'Painel Renata Anoana', email: 'painel@renataanoana.com.br' },
  };
  if (sha) body.sha = sha;
  return githubRequest(`/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

// Monta a URL pública da imagem a partir do raw.githubusercontent.com em vez
// do caminho relativo servido pelo GitHub Pages: o raw fica disponível quase
// na hora do commit, sem esperar o build/deploy do Pages (que pode levar
// minutos e deixa o produto visível sem foto por um tempo).
function toPublicImageUrl(imagePath) {
  if (!imagePath) return imagePath;
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  if (!owner || !repo) return imagePath;
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${imagePath}`;
}

module.exports = { getFile, putFile, toPublicImageUrl };
