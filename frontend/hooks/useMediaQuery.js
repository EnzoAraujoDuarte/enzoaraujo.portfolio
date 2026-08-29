import { useEffect, useState } from 'react';

/**
 * Starts false so server and first client render agree, then settles on the
 * real answer. Anything gated on this must be safe to omit for one frame.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);

  return matches;
}
