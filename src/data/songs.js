const spotifySearch = (title) => `https://open.spotify.com/search/${encodeURIComponent(`Jung Kook ${title}`)}`;
const appleSearch = (title) => `https://music.apple.com/search?term=${encodeURIComponent(`Jung Kook ${title}`)}`;

export const songs = [
  { title: 'Seven', subtitle: 'A sunlit summer love song', year: '2023', photoId: 'jk-5', spotify: spotifySearch('Seven'), apple: appleSearch('Seven') },
  { title: 'Standing Next to You', subtitle: 'A golden, feel-good groove', year: '2023', photoId: 'jk-12', spotify: spotifySearch('Standing Next to You'), apple: appleSearch('Standing Next to You') },
  { title: 'Still With You', subtitle: 'A soft rainy-night favorite', year: '2020', photoId: 'jk-4', spotify: spotifySearch('Still With You'), apple: appleSearch('Still With You') },
  { title: 'Euphoria', subtitle: 'A little burst of bright joy', year: '2018', photoId: 'jk-7', spotify: spotifySearch('Euphoria'), apple: appleSearch('Euphoria') },
  { title: 'Dreamers', subtitle: 'A hopeful anthem for dreamers everywhere', year: '2022', photoId: 'jk-9', spotify: spotifySearch('Dreamers FIFA Soundtrack'), apple: appleSearch('Dreamers FIFA Soundtrack') },
];
