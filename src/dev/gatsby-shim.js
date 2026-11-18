import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// Stand-in for the few things the dev-only workshop pages still import from 'gatsby'. Aliased in vite.config.js.
export const Link = ({ to, ...rest }) => <RouterLink to={to} {...rest} />;
export const navigate = (to, opts = {}) => (opts.replace ? window.location.replace(to) : window.location.assign(to));
