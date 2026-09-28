// This file handles communication with the Wikipedia API to fetch topic information, related links, and translations between languages.

import { getApiBase } from '../utils/i18n';

export const fetchWikipediaTopic = async (title, lang = 'en') => {
  const apiBase = getApiBase(lang);
  const linksUrl = `${apiBase}?action=query&titles=${encodeURIComponent(title)}&prop=links&plnamespace=0&pllimit=500&format=json&origin=*`;
  const detailsUrl = `${apiBase}?action=query&titles=${encodeURIComponent(title)}&prop=extracts&exintro=1&explaintext=1&exsentences=3&format=json&origin=*`;

  const [linksRes, detailsRes] = await Promise.all([
    fetch(linksUrl).then((r) => r.json()),
    fetch(detailsUrl).then((r) => r.json())
  ]);

  const page = Object.values(detailsRes.query?.pages || {})[0] || {};
  const links = (Object.values(linksRes.query?.pages || {})[0]?.links || []).map((l) => l.title);

  return {
    title: page.title || title,
    extract: page.extract || '',
    rawLinks: links
  };
};

export const fetchLangLink = async (title, fromLang, toLang) => {
  const apiBase = getApiBase(fromLang);
  const url = `${apiBase}?action=query&titles=${encodeURIComponent(title)}&prop=langlinks&lllang=${toLang}&format=json&origin=*`;
  const res = await fetch(url).then((r) => r.json());
  const page = Object.values(res.query?.pages || {})[0];
  const langlink = page?.langlinks?.[0];

  return langlink ? langlink['*'] : null;
};