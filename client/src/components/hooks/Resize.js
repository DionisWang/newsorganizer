import { useState, useEffect } from 'react';

const getWidth = () => document.body.clientWidth
  || document.documentElement.clientWidth 
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

const getHeight = () => document.body.clientHeight
  || document.documentElement.clientHeight
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