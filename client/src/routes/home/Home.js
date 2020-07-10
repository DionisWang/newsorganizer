import React, { lazy, Suspense } from 'react';
import {Spinner } from "react-bootstrap";
import useWidth, {useHeight} from '../../components/hooks/Resize';

const GoogleMap=lazy(()=>import('../../components/timeline_provider/GoogleMap'));
const Background= lazy(()=>import('../../components/news_provider/Background')) ;
const renderLoader = () => <Spinner animation="border" role="status"/>;
export default function Home(){
    let width= useWidth();
    let height = useHeight();
    return (
        <div id= "Home">
            <div id="News">
                <br></br>
                <h1>Current News</h1>
                <br></br>
                <Suspense fallback={renderLoader()}>
                    <Background max={9} size={width} formatting={1}></Background>
                </Suspense>
            </div>
            <div className="Timeline">
                <h1>Current Timeline</h1>
                <Suspense fallback={renderLoader()}>
                    <div className="map mx-auto">
                        <GoogleMap width={Math.min(width*.9,1024)+"px"} height={height*.7+"px"}></GoogleMap>
                    </div>
                </Suspense>
            </div>
        </div>
    )
}