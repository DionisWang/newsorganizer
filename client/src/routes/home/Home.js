import React from 'react';
import GoogleMap from '../../components/timeline_provider/GoogleMap';
import Background from '../../components/news_provider/Background';
import useWidth, {useHeight} from '../../components/hooks/Resize';

export default function Home(){
    let width= useWidth();
    let height = useHeight();
    return (
        <div id= "Home">
            <div id="News">
                <br></br>
                <h1>Current News</h1>
                <br></br>
                <Background max={9} size={width} formatting={1}></Background>
            </div>
            <div className="Timeline">
                <h1>Current Timeline</h1>
                <div className="map mx-auto">
                    <GoogleMap width={Math.min(width*.9,1024)+"px"} height={height*.7+"px"}></GoogleMap>
                </div>
            </div>
        </div>
    )
}