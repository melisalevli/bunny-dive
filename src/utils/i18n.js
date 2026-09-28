export const translations = {
  en: {
    logo: "Bunny Dive",
    heroTitle: "Go down\nthe rabbit hole",
    heroSub: "Start with any topic. Follow the trail. See where it leads.",
    searchPlaceholder: "e.g. Black hole, Renaissance...",
    conceptHeader: "THE RABBIT TRAIL",
    connectionsHeader: "CHOOSE YOUR NEXT HOP",
    fetchingLinks: "DIGGING FOR CONNECTIONS...",
    loadingDetails: "DIGGING DEEPER...",
    noSummary: "Nothing found down this trail.",
    exploredText: "explored",
    completeTitle: "YOU MADE IT.",
    completeSub: "You went down a {count}-topic rabbit hole.",
    exploreAgain: "DIVE BACK IN",
    switchLang: "TR"
  },
  tr: {
    logo: "Bunny Dive",
    heroTitle: "Tavşan\ndeliğine in",
    heroSub: "Herhangi bir konuyla başla. İzi takip et. Seni nereye götüreceğini gör.",
    searchPlaceholder: "örn. Kara delik, Rönesans...",
    conceptHeader: "TAVŞAN İZİ",
    connectionsHeader: "SIRADAKİ KONUYU SEÇ",
    fetchingLinks: "BAĞLANTILARIN İZİ SÜRÜLÜYOR...",
    loadingDetails: "DAHA DERİNE İNİLİYOR...",
    noSummary: "Bu iz burada sonlanıyor.",
    exploredText: "keşfedildi",
    completeTitle: "BAŞARDIN.",
    completeSub: "{count} konuluk bir tavşan deliğine indin.",
    exploreAgain: "TEKRAR İN",
    switchLang: "EN"
  }
};

export const getApiBase = (lang) => {
  return `https://${lang}.wikipedia.org/w/api.php`;
};