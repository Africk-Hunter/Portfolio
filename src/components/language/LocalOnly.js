import { useEffect, useState } from 'react';
import { navigate } from 'gatsby';

const LOCAL_HOSTS = ['localhost', '127.0.0.1', '[::1]', '::1'];

// The design-language pages are a workshop, not part of the public site: they render on localhost (and in
// `gatsby develop`) only. Anywhere else the visitor is sent back to the main page, and nothing from the page
// is in the server-rendered HTML, so it never flashes before the redirect.
export default function LocalOnly({ children }) {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const local = process.env.NODE_ENV === 'development' || LOCAL_HOSTS.includes(window.location.hostname);
    if (local) setOk(true);
    else navigate('/', { replace: true });
  }, []);

  return ok ? children : null;
}
