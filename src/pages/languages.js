import React from 'react';
import Language from '../components/language/Language';
import LocalOnly from '../components/language/LocalOnly';
import { Head as LanguageHead } from './language';

// /languages is the same localhost-only workshop as /language (it redirects home on the live site).
const LanguagesPage = () => <LocalOnly><Language /></LocalOnly>;

export default LanguagesPage;

export const Head = LanguageHead;
