import React, { useEffect } from 'react';
import fallbackimg from '../../images/fallback-img.png';

export default function LazyImage(props) {
    const imgRef=React.createRef();
    useEffect(()=>{
        if("IntersectionObserver" in window){
            //Using code from https://css-tricks.com/the-complete-guide-to-lazy-loading-images/
            var imageObserver = new IntersectionObserver((entries)=> {
                entries.forEach(function(entry) {
                  if (entry.isIntersecting) {
                    var image = entry.target;
                    image.src = image.dataset.src;
                    imageObserver.unobserve(image);
                  }
                });
            },{rootMargin:"400px"});
            imageObserver.observe(imgRef.current);
        }else{
            var lazyloadThrottleTimeout;
            
            function lazyload () {
            if(lazyloadThrottleTimeout) {
                clearTimeout(lazyloadThrottleTimeout);
            }    

            lazyloadThrottleTimeout = setTimeout(function() {
                var scrollTop = window.pageYOffset;
                if(imgRef.current.offsetTop < (window.innerHeight + scrollTop)) {
                    imgRef.current.src = imgRef.current.dataset.src;
                    }
            }, 20);
            }
            document.addEventListener("scroll", lazyload);
            window.addEventListener("resize", lazyload);
            window.addEventListener("orientationChange", lazyload);
        }
    })
    return (
        <img rel="preconnect" 
            className={"card-img"} ref={imgRef} 
            data-src={props.urlToImage}
            alt={`Link to ${props.newspaper} article`}
            onError={(e)=>{
                e.target.src=fallbackimg
            }}
            itemProp="thumbnailUrl"
        />            
    );
}