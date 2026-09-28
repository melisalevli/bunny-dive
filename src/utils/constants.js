// This file stores shared constants used throughout the app, including the Wikipedia API address, rabbit hole depth, number formatting, and link filtering rules.

export const API_BASE = 'https://en.wikipedia.org/w/api.php';
export const TARGET_DEPTH = 14;
export const pad2 = (n) => String(n).padStart(2, '0');
export const BLACKLIST_REGEX = /\b(19\d\d|20\d\d|century|list of|identifier|isbn|doi|wayback machine|bibcode|issn|pmid|s2cid|arxiv|gazetteer|geographic coordinate system|united states|united kingdom|mainland|international standard|dictionary|encyclopedia)\b/i;