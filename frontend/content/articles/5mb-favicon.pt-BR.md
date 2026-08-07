---
title: "Meu portfólio pesava 9 MB. O favicon sozinho tinha 5."
description: "Auditei meu próprio site e encontrei uma foto de perfil de 5 MB sendo servida como favicon em toda página. O que aprendi cortando 99,4% do peso dos assets."
date: 2026-08-07
tags: ["Performance", "Next.js", "Web"]
---

Tem uma ironia específica em ser desenvolvedor e ter o próprio site quebrado. Você passa o dia otimizando loja dos outros e o seu cartão de visitas carrega 9 MB de imagem.

Foi mais ou menos isso que descobri quando finalmente sentei para auditar este site.

## O achado que dói

O arquivo `novafotoperfil.png` tinha **5.071.432 bytes**. Cinco megabytes. Uma foto de 1933×1875 pixels renderizada, no máximo, a 320 pixels de largura.

Isso já seria ruim. Mas o problema real estava três linhas abaixo, no `_document.js`:

```html
<link rel="icon" href="/Images/novafotoperfil.png" />
<link rel="apple-touch-icon" href="/Images/novafotoperfil.png" />
```

O favicon apontava para a foto de 5 MB.

Favicon é buscado em **toda** navegação, em toda página. Cada pessoa que abrisse qualquer rota do site baixava 5 MB para desenhar um ícone de 16 pixels — que, a 16 pixels, virava uma mancha marrom irreconhecível.

E ainda tinha uma terceira camada. A página Sobre fazia isto:

```html
<link rel="preload" as="image" href="/Images/novafotoperfil.png" />
```

Um preload manual do arquivo original, em paralelo ao `next/image` que já servia uma versão otimizada. O navegador baixava a imagem grande **e** a versão processada. Preload feito com boa intenção e efeito invertido: em vez de acelerar, dobrava o trabalho.

Somando com um PNG de fundo de 4,5 MB, os dois arquivos davam **9,19 MB**.

## O conserto foi quase constrangedor de tão simples

Converti as duas imagens para WebP em dimensões compatíveis com o uso real:

| Arquivo | Antes | Depois |
|---|---|---|
| Foto de perfil | 5.071 KB | 40 KB |
| Fundo | 4.461 KB | 11 KB |
| Favicon | 5.071 KB | 0,6 KB |

O fundo caiu 99,7%. Não é mágica: é um gradiente suave, roxo sobre preto, e gradiente é exatamente o que compressão com perdas faz bem. O PNG estava guardando com precisão matemática uma imagem que não precisava de precisão nenhuma.

O favicon virou um monograma SVG que escrevi à mão — três barras brancas formando um "E" sobre um quadrado roxo. 600 bytes. E, diferente de um rosto, continua legível a 16 pixels.

Habilitei AVIF no `next.config.js`, que o Next não liga por padrão:

```js
images: {
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: 60 * 60 * 24 * 365,
}
```

No tamanho real de renderização, a foto agora sai em **17,7 KB** em AVIF. Contra 5 MB. É uma redução de 99,7% no arquivo que mais aparecia no site.

Total: de 9,19 MB para 55,6 KB. **−99,4%.**

## O loop que nunca parava

Assets são o problema óbvio. O interessante estava no JavaScript.

A home tem um efeito de distorção em WebGL no fundo do hero. O componente rodava assim:

```js
const animate = () => {
  requestAnimationFrame(animate);
  // ...cálculo por frame + render
};
animate();
```

Nada nesse código para. O `requestAnimationFrame` se re-agenda para sempre. Você rola a página até o rodapé — ele continua rodando a 60 fps. Você troca de aba — o navegador reduz o ritmo, mas o trabalho continua agendado. Em notebook, isso é ventoinha. Em celular, é bateria.

A correção é pausar quando ninguém está vendo:

```js
const visibilityObserver = new IntersectionObserver(([entry]) => {
  isOnScreen = entry.isIntersecting;
  isOnScreen ? startLoop() : stopLoop();
});
visibilityObserver.observe(container);

document.addEventListener('visibilitychange', handleVisibilityChange);
```

`IntersectionObserver` para quando o canvas sai da viewport, `visibilitychange` para quando a aba fica em segundo plano. Duas APIs nativas, nenhuma dependência.

## O bug que eu só achei porque testei errado

Enquanto tirava screenshots com Chrome headless para conferir o resultado, a home apareceu assim:

> Application error: a client-side exception has occurred.

Minha primeira reação foi assumir que eu tinha quebrado alguma coisa. Fui no console:

```
THREE.WebGLRenderer: Error creating WebGL context.
```

O Chrome headless roda com GPU desabilitada. Sem GPU, sem contexto WebGL. E aí:

```js
const renderer = new THREE.WebGLRenderer({ ... });
```

Essa linha **lança exceção**. Não havia try/catch, não havia error boundary. A exceção subia, o React desmontava a árvore inteira e a página virava tela de erro.

Voltei no commit anterior e confirmei: o bug já existia antes de eu tocar em qualquer coisa. Não era regressão — era uma falha real, esperando o usuário certo.

E existe usuário certo: dispositivo antigo, GPU na blocklist do navegador, driver desatualizado, configuração de privacidade que desliga WebGL. Para todos eles, a home não carregava com o fundo sem efeito. A home **não carregava**.

```js
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ ... });
} catch {
  setIsWebGLAvailable(false);
  return;
}
```

Sem WebGL, o componente cai para um fundo estático com a mesma imagem. Perde a interação, mantém a página.

A lição que fica: **efeito decorativo nunca deveria conseguir derrubar a página inteira.** Se o enfeite falhar, o conteúdo tem que continuar de pé.

## Três coisas menores que somam

**O seletor universal.** O CSS global tinha isto:

```css
* {
  @apply transition-colors duration-200;
}
```

Transição de cor em *todo* elemento do documento. Toda `<div>`, todo `<span>`, todo nó. Custo de estilo e composição espalhado pela árvore inteira para animar um punhado de hovers. Removi e apliquei transição onde ela realmente é usada.

**A fonte que ninguém usava.** O `<head>` carregava Inter, Poppins e Space Grotesk pelo Google Fonts. Procurei "Poppins" no código: zero ocorrências fora da própria tag de import. Três pesos baixados em toda visita para nada.

Migrei tudo para `next/font`, que faz self-host das fontes, gera o preload e elimina as duas viagens de rede até o domínio do Google — que eram render-blocking.

**O chat no bundle da home.** Um widget de 568 linhas importado estaticamente na página inicial. Virou `dynamic()`. A rota caiu de 9,05 kB para 4,51 kB.

## A parte que não é sobre performance

Com a casa arrumada, reescrevi a página Sobre. Ela era um conjunto de abas — Introdução, Habilidades, Formação, Carreira, Metas.

Abas parecem organização. Na prática, escondem conteúdo. E, no meu caso, escondiam de verdade: as abas inativas nem existiam no DOM. Não eram só invisíveis — não estavam lá. Não apareciam em busca da página, não eram lidas por leitor de tela sem interação, e o buscador via uma fração do conteúdo.

Trocar por scroll contínuo resolveu de graça um problema de acessibilidade que eu teria que resolver na unha: o widget de abas não tinha `role="tablist"`, não tinha navegação por setas, e no celular virava uma barra de rolagem horizontal com um aviso de "arraste para o lado". Sem abas, nada disso precisa existir.

Aproveitei para matar as barrinhas de porcentagem. Você já viu: "React 70%", "Python 55%". Elas dão uma precisão que não existe — ninguém mede isso — e convidam a uma comparação que não te favorece. "Python 55%" comunica menos do que simplesmente listar Pandas e Selenium e deixar o leitor tirar a própria conclusão.

## O que eu tiro disso

Nenhum desses problemas era difícil. Nenhum exigiu ferramenta cara, refatoração grande ou decisão arquitetural complicada. Uma foto no tamanho errado. Um `href` apontando para o arquivo errado. Um loop sem condição de parada. Um `try` que faltava.

O que eles tinham em comum é que ninguém tinha olhado.

Site pessoal é o projeto que a gente mais adia. Não tem cliente cobrando, não tem alerta de produção, não tem ninguém reclamando que está lento — porque quem visita não avisa, só fecha a aba.

Se você tem um, abre o DevTools na aba Network agora. Ordena por tamanho. Provavelmente vai encontrar algo tão bobo quanto o meu favicon de 5 MB.

*Este site continua em obras. Nas próximas etapas: tirar o sistema de tema morto, resolver o SSR renderizando sempre no idioma errado e — talvez o mais divertido — um bug de `border-radius` que descobri depois de escrever isto, em que 27 elementos usam uma variável CSS que nunca foi definida.*
