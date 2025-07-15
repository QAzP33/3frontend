import { useState, useEffect } from 'react';

const useIsMobile = (breakpoint = 1024) => {
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

    const handleChange = () => {
      setIsMobile(mediaQuery.matches);
    }

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change',handleChange);
  }, [breakpoint]);


  return isMobile;
};

export default useIsMobile;