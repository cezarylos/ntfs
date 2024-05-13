const axios = require('axios');
const cheerio = require('cheerio');

async function getLinksFromPage(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const links = [];
    $('a').each((index, element) => {
      const link = $(element).attr('href');
      if (link && link.startsWith('/wiki/') && !link.includes('#')) {
        links.push(link.replace('/wiki/', ''));
      }
    });
    return links;
  } catch (error) {
    console.error('Error fetching page:', error.message);
    return [];
  }
}

async function findPath(startPage, endPage, visited = new Set()) {
  try {
    if (startPage === endPage) {
      return [startPage];
    }

    const startUrl = `https://en.wikipedia.org/wiki/${startPage}`;
    const links = await getLinksFromPage(startUrl);

    for (const link of links) {
      if (!visited.has(link)) {
        visited.add(link);
        const path = await findPath(link, endPage, visited);
        if (path.length > 0) {
          return [startPage, ...path];
        }
      }
    }

    return [];
  } catch (error) {
    console.error('Error:', error.message);
    return [];
  }
}

async function main() {
  const startPage = 'Kingdom_of_Sicily'; // Replace with the actual start page title
  const endPage = 'Frying_pan'; // Replace with the actual end page title

  const path = await findPath(startPage, endPage);

  if (path.length > 0) {
    console.log('Connection found:', path.join(' -> '));
  } else {
    console.log('No connection found.');
  }
}

main();
