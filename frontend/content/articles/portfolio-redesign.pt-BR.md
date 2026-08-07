---
title: "Meu cartão de visitas estava desatualizado. Refiz a direção de arte inteira."
description: "Andei estudando os sites do Awwwards para entender como eles fazem 3D e transições. Este é o resultado: tipografia, shader no hero, movimento com propósito — e o que decidi não fazer."
date: 2026-08-07
tags: ["Design", "Motion", "WebGL", "Front-end"]
---

Tem uma ironia específica em ser desenvolvedor e ter o próprio site quebrado. Você passa o dia otimizando loja dos outros e o seu cartão de visitas fica desatualizado.

Foi mais ou menos isso que percebi quando finalmente sentei para olhar este site com olhos de designer, e não de programador.

## De onde veio o impulso

Faz um tempo que eu entro no [Awwwards](https://www.awwwards.com/sites) quase como quem lê revista. Não para copiar layout — para entender como aquilo é feito.

Sempre me pega a mesma coisa: elementos 3D que reagem ao mouse, transições entre páginas que não parecem carregamento, texto que aparece de um jeito que você não consegue explicar mas percebe que é diferente. De fora, parece magia. E magia é um péssimo lugar para parar, porque ou você acha que é inatingível, ou você copia sem entender.

Então decidi usar meu próprio site como laboratório. A regra que me dei foi simples: só entra no site o efeito que eu conseguir explicar. Se eu não sei por que funciona, não sei consertar quando quebrar.

Este artigo é o que sobrou depois desse filtro.

## O diagnóstico

O site não era feio. Era genérico — que é pior.

A página Sobre era um conjunto de abas: Introdução, Habilidades, Formação, Carreira, Metas. As habilidades apareciam em barrinhas de porcentagem. Cada seção era um cartão arredondado dentro de outro cartão arredondado. Os fundos eram chapados. Não existia rodapé — toda página simplesmente terminava no vazio.

Nada disso está tecnicamente errado. É só a aparência padrão de quem montou um portfólio seguindo tutoriais. Reconhecível a três metros de distância.

## Tipografia como sistema, não como escolha

O primeiro passo foi parar de tratar fonte como decoração.

Separei duas funções. **Space Grotesk** para display — títulos, números, rótulos. **Inter** para leitura — parágrafos, descrições. Não é escolha estética aleatória: Space Grotesk tem personalidade forte em corpo grande e cansa em texto corrido; Inter é o inverso.

Depois, os detalhes que ninguém nota conscientemente mas todo mundo sente:

**Tracking negativo em display.** Tipografia grande precisa de menos espaço entre letras, não mais. O nome no hero usa `-0.045em`. Sem isso, título grande parece esticado.

**Escala fluida.** Em vez de saltar entre breakpoints, o título interpola:

```css
font-size: clamp(2.5rem, 9vw, 7.5rem);
```

**Rótulos com tracking positivo.** O contrário do display. Texto pequeno em caixa alta precisa de respiro: `0.28em`. É o que faz um rótulo parecer intencional em vez de apenas pequeno.

## O elemento 3D: o que realmente acontece no hero

O fundo da home é WebGL — um plano com shader customizado, via three.js. Foi a primeira coisa que quis entender de verdade, porque é o tipo de efeito que me fazia achar que era magia.

Não é. É uma ideia só, e ela cabe em um parágrafo.

Existem **duas texturas**. A primeira é a imagem que você vê. A segunda é invisível: uma grade minúscula, 10 por 10, onde cada célula guarda dois números — um deslocamento horizontal e um vertical.

O fragment shader faz uma coisa apenas. Antes de ler o pixel da imagem, ele consulta a grade e desloca a coordenada de leitura:

```glsl
vec4 offset = texture2D(uDataTexture, vUv);
gl_FragColor = texture2D(uTexture, uv - 0.02 * offset.rg);
```

É isso. Se a célula guarda zero, o pixel é lido do lugar certo e a imagem aparece intacta. Se guarda um valor, o pixel é lido de um lugar levemente deslocado — e a imagem entorta ali.

O que dá vida é o que escreve nessa grade. A cada frame, o código faz duas coisas:

1. **Multiplica todos os valores por 0,9.** Cada célula perde 10% do deslocamento por frame. É o que faz a distorção relaxar sozinha até sumir.
2. **Injeta a velocidade do mouse nas células próximas ao cursor.** Não a posição — a *velocidade*. Mouse parado não distorce nada, por mais que esteja em cima.

Distorção que decai + energia injetada por movimento. Todo o efeito é isso.

Entender esse mecanismo mudou como eu olho para os sites que admiro. Quase sempre é uma ideia simples aplicada com rigor, não uma técnica secreta.

### Como colocar 3D no ar sem se arrepender

Aprender a fazer foi metade. A outra metade foi aprender a **entregar**.

Um canvas WebGL roda um laço de animação a 60 quadros por segundo. Se ninguém disser para parar, ele nunca para: você rola até o rodapé e ele continua desenhando; troca de aba e o trabalho continua agendado. Em notebook isso é ventoinha. Em celular é bateria.

Então o laço só roda quando faz sentido — um `IntersectionObserver` pausa quando o canvas sai da tela, e o evento `visibilitychange` pausa quando a aba vai para segundo plano.

E a regra que eu levo comigo agora: **enfeite não pode derrubar a página.** Criar um contexto WebGL pode falhar — GPU antiga, driver bloqueado, configuração de privacidade. Se isso acontecer, o componente cai para um fundo estático com a mesma imagem. Perde a interação, mantém o site de pé.

## Transições e movimento

Essa é a parte que mais mudou.

O site já tinha animação antes. O problema é que era sempre a mesma: aparecer e subir um pouco. Tudo entrava igual, então nada tinha hierarquia. Movimento sem hierarquia é ruído.

### Duas curvas, não quatro

Achei quatro curvas de easing diferentes espalhadas pelo código, cada uma escolhida no momento, sem relação com as outras. Reduzi a duas, cada uma com função:

```js
export const EASE = {
  // desacelera até parar — entradas normais
  out: [0.25, 0.46, 0.45, 0.94],
  // arranca e freia longo — revelações expressivas
  expressive: [0.16, 1, 0.3, 1],
};
```

Parece pequeno. Não é. Quando tudo desacelera do mesmo jeito, o conjunto ganha uma assinatura de movimento — e você percebe sem saber por quê.

### Revelação mascarada

O nome no hero antes embaralhava letras até revelar. Tirei: atrasava a informação mais importante da página para entregar um efeito que já foi novidade em 2021.

No lugar, o texto sobe de trás dos próprios limites:

```jsx
<span className="block overflow-hidden">
  <motion.span
    initial={{ y: '110%' }}
    animate={{ y: '0%' }}
    transition={{ duration: 0.9, ease: EASE.expressive }}
  >
    {children}
  </motion.span>
</span>
```

O truque é o `overflow-hidden` no pai. O texto existe, só está escondido atrás da borda. Quando sobe, parece que estava ali o tempo todo.

### Imagens entram por corte, não por opacidade

Fade em imagem é a solução preguiçosa. Corte é melhor:

```js
export const clipReveal = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.06 },
  visible: { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 },
};
```

A imagem é revelada de baixo para cima enquanto sai de uma escala levemente maior. Os dois juntos dão sensação de câmera se acomodando.

### O momento em que o scroll vira narrador

Todo site que eu admiro tem um gesto tipográfico que você lembra depois. O meu é uma frase — a que define como eu trabalho — que acende palavra por palavra conforme você rola. Cada palavra recebe sua fatia do progresso:

```jsx
const opacity = useTransform(progress, [start, end], [0.15, 1]);
```

Com uma cópia apagada por baixo, para a frase nunca aparecer do nada: ela já está lá, só não foi lida ainda. O scroll deixa de ser navegação e vira ritmo.

### Camadas em velocidades diferentes

Profundidade não vem de sombra. Vem de coisas se movendo em velocidades diferentes. O fundo deriva 12% ao longo da página. As imagens de projeto derivam dentro do próprio quadro. O conteúdo do hero sobe um pouco mais rápido ao sair de cena.

Nenhum desses movimentos é perceptível isolado. O conjunto é o que cria a sensação de espaço.

### A transição entre páginas

Essa foi a mais difícil de acertar, e a que mais me ensinou.

A ideia é simples: um painel sobe cobrindo a página que sai e continua subindo para revelar a que entra. Uma varredura só, contínua.

Minha primeira versão animava escala junto com a origem do transform — cobria crescendo do fundo, depois encolhia para o topo. Travava no meio do caminho.

A solução foi abandonar escala e usar deslocamento em um eixo só. E aí veio a parte que eu gostei: **a animação passa a se auto-corrigir.** Se a rota nova carrega antes da cobertura terminar, a revelação simplesmente continua o mesmo movimento para cima, em vez de brigar com ele. O painel nunca precisa saber em que fase está — ele só sobe.

Um detalhe que importa mais do que parece: o painel é `pointer-events: none`. Mesmo que algo dê errado, ele nunca pode prender um clique.

### E quem não quer movimento

Tudo isso respeita `prefers-reduced-motion`. Vale um aviso que me custou tempo: a guarda em CSS não alcança animação feita em JavaScript. Se o movimento é calculado no código, você precisa checar a preferência no código também — senão você acha que respeitou e não respeitou.

## Menos caixa, mais filete

Cartão arredondado é a forma mais rápida de agrupar informação. Também é a mais previsível. Troquei quase todos por filete e respiro — uma linha de 1px e espaço suficiente separam tão bem quanto borda com fundo e sombra, e não gritam "componente de biblioteca".

As barrinhas de porcentagem foram junto. "React 70%", "Python 55%" — números que ninguém mede e que convidam a uma comparação que não me favorece. Listar Pandas e Selenium diz mais sobre o que eu faço com Python do que qualquer percentual inventado.

## Textura e o rodapé que não existia

Fundo `#111` chapado é digital demais. Adicionei grão gerado em SVG, a 3,5% de opacidade. Você não vê — você sente. É a diferença entre uma superfície e uma cor.

E o mais óbvio, que eu não tinha visto: o site não tinha rodapé nenhum. Toda página terminava no vazio, sem fecho e sem contato. Agora termina com uma frase grande e os caminhos do site.

## O que eu decidi não fazer

Duas coisas que quase todo site premiado tem e que deixei de fora de propósito.

**Cursor customizado.** Substituir o cursor do sistema atrapalha quem depende dele, quebra a affordance de clique e não acrescenta nada além de vitrine.

**Tela de loading inicial.** Ela existe para dar sensação de peso. Mas eu tinha acabado de deixar o site leve — inventar espera para parecer sofisticado seria desfazer o trabalho no lugar mais visível.

Direção de arte também é o que você escolhe recusar.

## O que eu tiro disso

A diferença entre um portfólio genérico e um que parece decidido quase nunca está em ter mais efeito. Está em coerência: duas fontes com funções claras, duas curvas de movimento, uma forma de revelar imagem, um jeito de separar seção.

E a lição maior veio do shader: o que parecia inatingível era uma grade de números decaindo 10% por frame. Continua tendo muito que eu não sei fazer — geometria de verdade, iluminação, cena com profundidade real. Mas agora sei por onde começar a perguntar.

Se você também fica olhando esses sites achando que é outro nível: escolhe um efeito, um só, e vai até entender por que ele funciona. É mais simples do que parece, e some a sensação de magia — que é exatamente o objetivo.
