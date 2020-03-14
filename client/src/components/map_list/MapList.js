import React, { useContext, useState } from "react";
import { Button} from "react-bootstrap";
import {Context} from '../hooks/UserProfile';

export default function MapList(props) {
    const [profile] = useContext(Context);
    const [current, setCurrent]= useState(+window.localStorage.getItem("cur")|| 0);
    let content= [];
    if(!profile.isLoaded){
        return (<div className="map-list"><br/><p>Loading timelines...</p></div>)
    }
    profile.maps.forEach((element,i) => {
        let variant="info";
        if(i===current){
            variant="success";
        }
        content.push(<Button variant={variant} key={element.name} size="sm" onClick={()=>{
            window.localStorage.setItem("cur",i);
            setCurrent(i);
            
            if(props.cstUpdate){
                props.cstUpdate(i);
            }
        }}>{element.name}</Button>)
    });
    return (<>
        <div className="map-list">
            {content}
        </div>
    </>);
}