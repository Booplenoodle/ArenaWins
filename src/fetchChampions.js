import https from 'https';
import fs from 'fs';

const versionsUrl = 'https://ddragon.leagueoflegends.com/api/versions.json';

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function fetchLatestChampions() {
  try {
    const versions = await fetchJSON(versionsUrl);
    const latestVersion = versions[0];
    console.log('Latest version:', latestVersion);

    const championUrl = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`;
    const championData = await fetchJSON(championUrl);

    const championsArray = Object.values(championData.data);

    fs.writeFileSync('champions-latest.json', JSON.stringify(championsArray, null, 2));

    console.log('Saved champions-latest.json');
  } catch (error) {
    console.error('Error fetching champion data:', error);
  }
}

fetchLatestChampions();
