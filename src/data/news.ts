/**
 * NOTÍCIAS E EVENTOS da home.
 *
 * Para publicar uma novidade, acrescenta um item a esta lista (a mais recente
 * pode ir em qualquer posição: a página ordena por data).
 *
 *   {
 *     date: "2026-03-14",                  // AAAA-MM-DD
 *     source: "Futurália",                 // opcional: onde foi / quem publicou
 *     title: "O NEETI esteve na Futurália",
 *     href: "https://...",                 // opcional: link (externo ou /pagina)
 *   },
 *
 * Enquanto a lista estiver vazia, a secção NÃO aparece no site publicado.
 * (Só em `npm run dev` aparecem 3 exemplos, marcados como "Exemplo", para
 * veres como fica.)
 */
export type NewsItem = {
  date: string;
  source?: string;
  title: string;
  href?: string;
};

export const NEWS: NewsItem[] = [];
