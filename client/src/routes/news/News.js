import React from 'react';
import Background from '../../components/news_provider/Background';
import useWidth from '../../components/hooks/Resize';


export default function News(){
    let width = useWidth();
    return (
        <div id="News">
            <br></br>
            <h1>Current News</h1>
            <br></br>
            <div id="news">
                <Background size={width} max={6}></Background>
            </div>
        </div>
    )
}
