# Site Renata Anoana

Protótipo de vitrine para a **Renata Anoana Acessórios** (pratas e bijuterias), com cards de produto e botão de compra que abre o WhatsApp com uma mensagem já preenchida.

## Como abrir

Dê dois cliques em `index.html`. É um arquivo único, autocontido — todo o CSS, JavaScript, imagens dos produtos e a logo estão embutidos nele. Não precisa de servidor, internet (exceto para carregar as fontes do Google Fonts) nem de nenhuma outra pasta ou arquivo.

Prévia publicada (para enviar o link sem precisar do arquivo): https://claude.ai/artifact/WWdZ877QorF86XxecZprRt

## Dados de contato usados no site

- **WhatsApp:** (62) 9 9651-4773 — todos os botões de compra levam para `wa.me/556296514773` com uma mensagem pronta mencionando a peça e o preço.

## Estrutura da página

1. **Cabeçalho** fixo: logo, menu (Início, Catálogo, Contato) e botão "Fazer pedido" no WhatsApp. No celular o menu vira uma gaveta aberta pelo botão ☰.
2. **Início (`#inicio`)**: título, texto, botões "Ver catálogo" e "Falar no WhatsApp" e a foto de destaque (braceletes de prata sobre cetim rosé), que ocupa o lado direito até a borda da tela no computador e vira uma faixa abaixo do texto no celular.
3. **Catálogo (`#catalogo`)**: filtros por categoria e cards dos produtos.
4. **Rodapé (`#contato`)**: sobre a loja, dados de pedido (WhatsApp, envio, Instagram) e redes sociais.
5. Botão flutuante do WhatsApp no canto da tela.

## Estrutura do catálogo

O site trabalha com 7 categorias: Colares, Anéis, Pulseiras, Braceletes, Brincos, Conjuntos e Pingentes. Os filtros só aparecem para categorias que têm pelo menos um produto.

| Produto | Categoria | Preço |
|---|---|---|
| Conjunto Coral Vermelho | Conjuntos | R$ 379,90 |
| Colar Cristais Azuis e Madrepérola | Colares | R$ 259,90 |
| Anel Rosa Vermelha | Anéis | R$ 179,90 |
| Conjunto Esmeralda Vintage | Conjuntos | R$ 459,90 |
| Conjunto Rubi Vintage | Conjuntos | R$ 429,90 |
| Brinco Gota Turquesa | Brincos | R$ 189,90 |
| Bracelete Prata Lisa | Braceletes | R$ 219,90 |
| Conjunto Pedra Verde | Conjuntos | R$ 329,90 |
| Anel Marquise Verde | Anéis | Consulte o valor |
| Pulseira Flores Verdes | Pulseiras | R$ 299,90 |
| Brinco Oval Verde | Brincos | Consulte o valor |
| Trio de Anéis Olho de Tigre | Anéis | Consulte o valor |
| Braceletes Quadrados e Argolinhas | Braceletes | R$ 179,90 |
| Anéis Prata Turca com Zircônias Coloridas | Anéis | R$ 185,90 |
| Conjunto Verde: Anéis e Pulseira | Conjuntos | Consulte o valor |
| Anéis Vermelho e Rosa | Anéis | Consulte o valor |
| Conjunto Vermelho: Brincos e Pulseira | Conjuntos | Consulte o valor |
| Brinco Topázio Azul | Brincos | R$ 279,90 |

> ⚠️ **Os preços das 8 primeiras peças foram estimados**, já que não foram informados pela Renata Anoana. Confirme os valores reais antes de divulgar o site.

**Material:** cada card mostra o material abaixo do nome da peça. O padrão é "Prata Turca"; estão em "Prata 925" o Conjunto Coral Vermelho, o Conjunto Pedra Verde, o Brinco Gota Turquesa, o Bracelete Prata Lisa, o Trio de Anéis Olho de Tigre, os Braceletes Quadrados e Argolinhas e o Brinco Topázio Azul. No painel, escolha o material no campo "Material" do formulário (as opções ficam em `MATERIALS`, no `admin.html`). No `index.html`, o texto fica em cada `<p class="material">`. Os filtros do catálogo (e o menu do celular) também têm "Prata 925" e "Prata Turca", no fim da lista de categorias: eles mostram as peças pelo texto do material de cada card. No painel, o site exportado ganha um filtro para cada material de `MATERIALS`.

As 10 últimas peças da tabela são bijuterias. **"Consulte o valor":** no painel, se o preço ficar em branco, o card mostra "Consulte o valor", e o botão "Consultar valor" abre o WhatsApp perguntando valor e disponibilidade da peça. Quando o catálogo do painel já estava salvo no navegador, as peças novas do catálogo original entram uma única vez; se forem removidas, não voltam.

## Identidade visual

- **Paleta:** rosa aquarela, nude e rose gold, só em tema claro (o site aparece claro mesmo com o modo escuro do sistema ligado). As cores ficam nos tokens do topo do `<style>`.
- **Tipografia:** Cormorant Garamond (títulos) + Manrope (texto).
- **Logo/favicon:** o monograma "RA" em rose gold (com o diamante), recortado da logo nova da Renata Anoana. Aparece no selo do cabeçalho e do rodapé (128×128) e, recortado em círculo, no ícone da aba do navegador (96×96).

## Como editar

Abra o `index.html` em qualquer editor de texto (Bloco de Notas, VS Code etc.).

- **Trocar nome, preço ou texto de um produto:** procure pelo título do produto (ex.: `Anel Rosa Vermelha`) e edite o texto dentro das tags `<h3>` e `<span class="price">`.
- **Trocar o número de WhatsApp:** procure por `556296514773` (aparece no cabeçalho, no menu do celular, no início, no rodapé, no botão flutuante e em cada produto) e substitua em todas as ocorrências. Faça o mesmo no `admin.html`.
- **Trocar uma foto de produto:** é preciso converter a nova imagem para o formato base64 e substituir o conteúdo depois de `data:image/jpeg;base64,` daquele card. Se não tiver como fazer isso manualmente, me envie a foto nova que eu atualizo o arquivo.
- **Foto de destaque do início:** fica no bloco `hero-media` (`data:image/jpeg;base64,...`) e é fixa, ou seja, não depende do catálogo. Para trocar, substitua o base64 no `index.html` **e** no `SITE_TEMPLATE` do `admin.html`. Use uma foto horizontal com a peça mais para a direita, porque o lado esquerdo da imagem desbota para o fundo.
- **Adicionar um produto novo:** copie um bloco `<article class="card" ...> ... </article>` inteiro, cole antes do `</div>` que fecha `<div class="grid" id="grid">`, e ajuste categoria, título, preço, link e foto.

## Painel (`admin.html`)

O painel é tela de login + CRUD de produtos que fala com um backend em `/api` (funções serverless). Os **dados dos produtos** (título, preço, descrição etc.) ficam no **RavenDB**; as **fotos** continuam sendo commitadas no repositório via API do GitHub, como antes — só o texto/preço saiu do fluxo de commit, porque é o que mudava com mais frequência.

### Backend (`/api`) e deploy na Vercel

O site estático (`index.html`, `admin.html`) continua no **GitHub Pages**, em `renataanoana.com.br` — só o backend (`/api`) roda na **Vercel**, no subdomínio `api.renataanoana.com.br`. Isso evita colocar a vitrine comercial no plano gratuito da Vercel (cujos termos restringem o Hobby a uso não-comercial) e mantém o GitHub Pages, que não tem essa restrição, cuidando do que já funciona.

- `api/login.js`, `api/logout.js`, `api/session.js` — autenticação por senha única, sessão em cookie `httpOnly` assinado (sem biblioteca de JWT, HMAC simples em `api/_lib/auth.js`).
- `api/products.js` — CRUD (`GET`/`POST`/`PUT`/`DELETE`) dos produtos no RavenDB, protegido por sessão. As fotos continuam indo pro GitHub via `api/_lib/github.js`.
- `api/catalog.js` — endpoint **público** (sem login) que o `index.html` usa pra mostrar o catálogo: lê o RavenDB ao vivo, sem cache (`Cache-Control: no-store`).
- `api/_lib/ravendb.js` — abre a sessão do RavenDB (RavenDB Cloud, autenticação por certificado cliente).
- `api/_lib/cors.js` — libera CORS (com credenciais) só para as origens em `ALLOWED_ORIGINS`, já que front e API ficam em domínios diferentes.

Passos para publicar:

1. Importar este repositório na Vercel (framework "Other", sem build command — o deploy da Vercel serve só o `/api`; o `index.html`/`admin.html` publicados por ela não são usados, quem serve o site é o GitHub Pages).
2. Configurar as variáveis de ambiente do projeto na Vercel (veja `.env.example`):
   - `ADMIN_PASSWORD_HASH` — hash bcrypt da senha da Renata.
   - `SESSION_SECRET` — string aleatória longa.
   - `GITHUB_TOKEN` — Personal Access Token (fine-grained) com permissão de escrita em "Contents" **apenas neste repositório**, usado só pras fotos.
   - `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH`.
   - `ALLOWED_ORIGINS` — `https://renataanoana.com.br,https://www.renataanoana.com.br` (origens do GitHub Pages autorizadas a chamar a API).
   - `RAVENDB_URLS`, `RAVENDB_DATABASE`, `RAVENDB_CERT_BASE64`, `RAVENDB_CERT_PASSWORD` — conexão com a instância do RavenDB Cloud (veja comentários no `.env.example`).
3. Em **Settings → Domains** do projeto na Vercel, adicionar `api.renataanoana.com.br` (não o domínio raiz — esse continua no GitHub Pages). Criar no registrador do domínio um registro `CNAME` para o host `api` apontando para o valor que a Vercel indicar (ex.: `cname.vercel-dns.com`), sem mexer nos registros do domínio raiz nem do `www`.
4. Rodar `node scripts/migrate-to-ravendb.js` **uma única vez** (localmente, com as mesmas variáveis num `.env`) pra importar os produtos que já estavam em `products.json` pro RavenDB.

Depois da migração, o `products.json` do repositório para de ser atualizado (as fotos continuam sendo commitadas normalmente) — ele vira só um retrato congelado de antes da migração, usado como último recurso se a API e o `raw.githubusercontent.com` estiverem fora do ar ao mesmo tempo (veja a cadeia de fontes do catálogo no `index.html`).

## Observações

Este é um protótipo de apresentação comercial — antes de publicar oficialmente, revise preços, textos e fotos com a Renata Anoana.
