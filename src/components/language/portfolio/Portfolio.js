import React from 'react';
import { portfolioThemes } from './themes';

// Each language has its own portfolio format; this just picks the right one.
export default function Portfolio({ themeId }) {
  const { Component } = portfolioThemes[themeId];
  return <Component />;
}
