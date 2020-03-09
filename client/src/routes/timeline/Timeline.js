import React from 'react';
import GoogleMap from '../../components/timeline_provider/GoogleMap';
import useWidth, {useHeight} from '../../components/hooks/Resize';


export default function Timeline(){
    let width = useWidth();
    let height = useHeight();
    return (
        <div className="Timeline">
            <br></br>
            <h1>Current Timeline</h1>
            <div className="map">
                <GoogleMap width={Math.min(width*.9,1024)+"px"} height={height*.65+"px"}></GoogleMap>
            </div>
        </div>
    )
}