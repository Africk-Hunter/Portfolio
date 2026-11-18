import { links } from './portfolio/data';

const SITE = 'https://hunterafrick.com';

// Profile URLs for the Person's sameAs. Bandcamp and Spotify are the artist pages, not single albums.
const profile = {
  GitHub: 'https://github.com/Africk-Hunter',
  Bandcamp: 'https://huntersmusic.bandcamp.com',
  Spotify: links.find((l) => l.name === 'Spotify').href.split('?')[0],
  LinkedIn: links.find((l) => l.name === 'LinkedIn').href,
};

export const person = {
  '@type': 'Person',
  '@id': `${SITE}/#person`,
  name: 'Hunter Africk',
  url: `${SITE}/`,
  image: `${SITE}/og-image.png`,
  jobTitle: 'Web developer and designer',
  description: 'Web developer and designer in Reno, NV who also writes and produces hip hop music.',
  address: { '@type': 'PostalAddress', addressLocality: 'Reno', addressRegion: 'NV', addressCountry: 'US' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of Nevada, Reno' },
  knowsAbout: ['Web development', 'Web design', 'React', 'Gatsby', 'TypeScript', 'Music production'],
  sameAs: Object.values(profile),
};

// Home page: the Person plus the WebSite they own.
export const homeSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    person,
    { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: 'Hunter Africk', inLanguage: 'en-US', publisher: { '@id': person['@id'] } },
  ],
};

// Inner pages: the page itself (about the Person) with a breadcrumb back to the home page.
export const pageSchema = ({ path, name, description }) => ({
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebPage', '@id': `${SITE}${path}#webpage`, url: `${SITE}${path}`, name, description, inLanguage: 'en-US', isPartOf: { '@id': `${SITE}/#website` }, about: { '@id': person['@id'] } },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name, item: `${SITE}${path}` },
    ] },
    person,
  ],
});
