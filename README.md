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

O site trabalha com 6 categorias: Colares, Anéis, Pulseiras, Braceletes, Brincos e Pingentes. Os filtros só aparecem para categorias que têm pelo menos um produto.

| Produto | Categoria | Preço |
|---|---|---|
| Conjunto Coral Vermelho | Anéis | R$ 379,90 |
| Colar Lua de Turquesa | Colares | R$ 259,90 |
| Anel Rosa Vermelha | Anéis | R$ 179,90 |
| Conjunto Esmeralda Vintage | Anéis | R$ 459,90 |
| Conjunto Rubi Vintage | Anéis | R$ 429,90 |
| Brinco Gota Turquesa | Brincos | R$ 169,90 |
| Bracelete Prata Lisa | Braceletes | R$ 219,90 |
| Conjunto Pedra Verde | Anéis | R$ 329,90 |
| Anel Marquise Verde | Anéis · Bijuteria | Consulte o valor |
| Pulseira Flores Verdes | Pulseiras · Bijuteria | Consulte o valor |
| Brinco Oval Verde | Brincos · Bijuteria | Consulte o valor |
| Trio de Anéis Olho de Tigre | Anéis · Bijuteria | Consulte o valor |
| Braceletes Quadrados e Argolinhas | Braceletes · Bijuteria | Consulte o valor |
| Anéis Mosaico Coloridos | Anéis · Bijuteria | Consulte o valor |
| Conjunto Verde: Anéis e Pulseira | Anéis · Bijuteria | Consulte o valor |
| Anéis Vermelho e Rosa | Anéis · Bijuteria | Consulte o valor |
| Conjunto Vermelho: Brincos e Pulseira | Brincos · Bijuteria | Consulte o valor |
| Brinco Quadrado Azul | Brincos · Bijuteria | Consulte o valor |

> ⚠️ **Os preços das 8 primeiras peças foram estimados**, já que não foram informados pela Renata Anoana. Confirme os valores reais antes de divulgar o site.

**Bijuterias e "Consulte o valor":** no painel, a caixa "Bijuteria" mostra uma etiqueta no canto da foto. Se o preço ficar em branco, o card mostra "Consulte o valor", e o botão "Consultar valor" abre o WhatsApp perguntando valor e disponibilidade da peça. Quando o catálogo do painel já estava salvo no navegador, as peças novas do catálogo original entram uma única vez; se forem removidas, não voltam.

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

## Painel (`admin.html`) e exportação

O botão "Baixar site atualizado" do painel gera um `index.html` completo a partir do `SITE_TEMPLATE` (dentro do `admin.html`), preenchendo logo, favicon, filtros e cards (a foto de destaque do início já vem fixa no template). **Se mudar a estrutura, o CSS ou os textos fixos do `index.html`, mude também o `SITE_TEMPLATE`** — senão a próxima exportação desfaz a mudança.

## Observações

Este é um protótipo de apresentação comercial — antes de publicar oficialmente, revise preços, textos e fotos com a Renata Anoana.
