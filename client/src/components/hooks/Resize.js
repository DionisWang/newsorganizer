import { useState, useEffect } from 'react';

const getWidth = () => document.documentElement.clientWidth 
  || document.body.clientWidth
  || window.innerWidth;

export default function useWidth() {
  let [width, setWidth] = useState(getWidth());

  useEffect(() => {
    let timeoutId = null;
    const resizeListener = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setWidth(getWidth()), 150);
    };
    window.addEventListener('resize', resizeListener);
    window.addEventListener('orientationchange', resizeListener);

    return () => {
      window.removeEventListener('resize', resizeListener);
      window.removeEventListener('orientationchange', resizeListener);
    }
  }, [])
  
  return width;
}

const getHeight = () => document.documentElement.clientHeight 
  || document.body.clientHeight
  || window.innerHeight;

export function useHeight() {
    let [height, setHeight] = useState(getHeight());
  
    useEffect(() => {
      let timeoutId = null;
      const resizeListener = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => setHeight(getHeight()), 150);
      };
      window.addEventListener('resize', resizeListener);
      window.removeEventListener('orientationchange', resizeListener);

      return () => {
        window.removeEventListener('resize', resizeListener);
        window.removeEventListener('orientationchange', resizeListener);

      }
    }, [])
    
    return height;
}