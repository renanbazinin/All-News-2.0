export interface NewsItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  imageUrl?: string;
  newsType: string;
}

export interface NewsSource {
  id: string;
  name: string;
  endpoint: string;
  logoUrl: string;
  isHebrew: boolean;
}

export type DisplayMode = 'list' | 'card';

export const NEWS_SOURCES: NewsSource[] = [
  {
    id: 'bbc',
    name: 'BBC News',
    endpoint: 'bbc',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/BBC_News_2022_%28Alt%29.svg/640px-BBC_News_2022_%28Alt%29.svg.png',
    isHebrew: false,
  },
  {
    id: 'nyt',
    name: 'NYT News',
    endpoint: 'nyt',
    logoUrl: 'https://cdn0.iconfinder.com/data/icons/circle-icons/512/new_york_times.png',
    isHebrew: false,
  },
  {
    id: 'ynet',
    name: 'Ynet News',
    endpoint: 'ynet',
    logoUrl: 'https://ynetads-10fd1.firebaseapp.com/assets/client/imgs/logo-ynet.png',
    isHebrew: true,
  },
  {
    id: 'maariv',
    name: 'Maariv News',
    endpoint: 'maariv',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Maariv_Online_Logo.png',
    isHebrew: true,
  },
  {
    id: 'n12',
    name: 'N12 News',
    endpoint: 'n12',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Keshet12_2018.svg/1200px-Keshet12_2018.svg.png',
    isHebrew: true,
  },
  {
    id: 'rotter',
    name: 'Rotter News',
    endpoint: 'rotter',
    logoUrl: 'https://i.imgur.com/W9mLeYa.png',
    isHebrew: true,
  },
  {
    id: 'walla',
    name: 'Walla News',
    endpoint: 'walla',
    logoUrl: 'https://i.imgur.com/pNH2rCR.png',
    isHebrew: true,
  },
  {
    id: 'calcalist',
    name: 'Calcalist News',
    endpoint: 'calcalist',
    logoUrl: 'https://i.imgur.com/R5OAqmj.png',
    isHebrew: true,
  },
  {
    id: 'haaretz',
    name: 'Haaretz News',
    endpoint: 'haaretz',
    logoUrl: 'https://i.imgur.com/WMwYtrz.png',
    isHebrew: true,
  },
];
