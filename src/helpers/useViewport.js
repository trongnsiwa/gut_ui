import * as React from 'react';

const useViewport = () => {
  const [width, setWidth] = React.useState(0);
  const [first, setFirst] = React.useState(true);

  React.useEffect(() => {
    if (first) {
      setWidth(window.innerWidth);
      setFirst(!first);
    }
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [first]);

  // Return the width so we can use it in our components
  return { width };
};

export default useViewport;
