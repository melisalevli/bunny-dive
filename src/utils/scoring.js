// This file filters and ranks Wikipedia links to choose the most relevant topics for the next step in the rabbit hole.
// Filters by removing unwanted or special pages, then ranks the remainings. Topics mentioned in the summary receive higher scores, topics sharing meaningful words with the current title receive additional points, and the six highest-scoring topics are selected for the next step in the rabbit hole.

import { BLACKLIST_REGEX } from './constants';

export const filterAndScoreLinks = (currentTitle, rawLinks, summaryText) => {
  const lowerSummary = (summaryText || '').toLowerCase();

  return rawLinks
    .filter((link) => !BLACKLIST_REGEX.test(link) && !link.includes(':'))
    .map((linkTitle) => {
      let score = 1;
      const lowerLink = linkTitle.toLowerCase();

      if (lowerSummary.includes(lowerLink)) score += 5;

      const words = currentTitle.toLowerCase().split(' ');
      if (words.some((w) => w.length > 3 && lowerLink.includes(w))) score += 3;

      return { title: linkTitle, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((item) => item.title);
};