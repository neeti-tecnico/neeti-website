# NEETI — Website

Site do **Núcleo de Estudantes de Telecomunicações e Informática** do Instituto Superior Técnico.

É um site informativo e estático (sem base de dados nem contas de utilizador), feito com [Next.js 14](https://nextjs.org/) (App Router), React, TypeScript e Tailwind CSS.

## Como correr localmente

**Requisitos:** [Node.js](https://nodejs.org/) 18.17 ou superior (recomendado: 20 LTS) e Git.

```bash
git clone https://github.com/neeti-tecnico/neeti-website.git
cd neeti-website
npm install
npm run dev
```

Abre <http://localhost:3000>. Ao gravar um ficheiro, o browser atualiza sozinho.

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (para trabalhar) |
| `npm run build` | Gera a versão de produção e verifica erros de tipos |
| `npm start` | Serve a versão gerada pelo `build` |

> O `npm run build` descarrega a fonte Inter do Google Fonts, por isso precisa de acesso à internet.

## Estrutura do projeto

```
public/                 imagens e ficheiros servidos tal como estão (fotos, logos)
src/app/                as páginas: cada pasta corresponde a um endereço
  page.tsx                /          home
  curso/page.tsx          /curso     o curso de ETI
  team/page.tsx           /team      direção atual e histórico
  contactos/page.tsx      /contactos contactos e órgãos sociais
  shelf/page.tsx          /shelf     link para a Shelf (Drive)
  shop/page.tsx           /shop      (em desenvolvimento)
  layout.tsx              estrutura comum a todas as páginas (título, língua, fonte)
  globals.css             cores e estilos globais
src/components/         peças reutilizáveis (menu, footer, secções, hero)
```

## Onde mudar o conteúdo

| Quero mudar… | Ficheiro |
|---|---|
| Textos e imagens das secções da home | `src/app/page.tsx` |
| Direção atual e anos anteriores | `src/app/team/page.tsx` (listas `currentYearDirectors` e `pastYears`) |
| Emails e órgãos sociais | `src/app/contactos/page.tsx` |
| Redes sociais no rodapé | `src/components/footer.tsx` |
| Título e descrição do site | `src/app/layout.tsx` |
| Fotos | colocar em `public/` e referir pelo nome (ex.: `/foto.jpg`) |

## Como contribuir

1. Cria um branch a partir do `main`: `git checkout -b nome-da-alteracao`
2. Faz as alterações e confirma que `npm run build` passa sem erros.
3. Faz commit, publica o branch e abre um Pull Request para o `main`.
4. Outro membro revê e faz o merge. O `main` deve estar sempre estável.

## Estado e notas

- **Deploy:** o site online atual é a versão antiga, nos servidores do IST. A publicação desta versão está por definir (depende do que o servidor do IST suporta).
- **Next.js 14:** o `npm audit` ainda assinala vulnerabilidades do próprio Next 14, que só se resolvem subindo para a versão 15.5 ou superior. Dizem respeito a funcionalidades de servidor do Next, por isso convém ter isto em conta ao decidir como publicar o site.
