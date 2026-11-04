// Which portfolio format belongs to which language. Keys match the iteration ids in Language.js.
import Desktop from './Desktop';
import Catalogue from './Catalogue';
import Zine from '../../portfolio/Zine';
import Index from './Index';
import Greenhouse from './Greenhouse';

export const portfolioThemes = {
  original: { name: 'Desktop', Component: Desktop },
  a: { name: 'Catalogue', Component: Catalogue },
  f: { name: 'Zine', Component: Zine },
  g: { name: 'Index', Component: Index },
  h: { name: 'Greenhouse', Component: Greenhouse },
};

export const portfolioIds = Object.keys(portfolioThemes);
