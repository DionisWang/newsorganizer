import React from 'react';
import { Card, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import LongText from './LongText';

function lastUpdated(ms){
    let sec = Math.floor(ms/1000);
    let min = Math.floor(sec/60);
    let hrs = Math.floor(min/60);
    let days = Math.floor(hrs/24);
    let months = Math.floor(days/30);
    let years = Math.floor(months/12);
    if(sec<60){
        if(sec===1){
            return "a second ago";
        }else{
            return Math.floor(sec) + " seconds ago";
        }
    }else if(min<60){
        if(min===1){
            return "a minute ago";
        }else{
            return Math.floor(min) + " minutes ago";
        }
    }else if(hrs<24){
        if(hrs===1){
            return "an hour ago";
        }else{
            return Math.floor(hrs) + " hours ago";
        }
    }else if(days<30){
        if(days===1){
            return "a day ago";
        }else{
            return Math.floor(days) + " days ago";
        }
    }else if(months<12){
        if(months===1){
            return "a month ago";
        }else{
            return Math.floor(months) + " months ago";
        }
    }else{
        if(years===1){
            return "a year ago";
        }else{
            return Math.floor(years) + " years ago";
        }
    }

}

export default function NewsCard(props) {
    let {a,handleClick,that,ncol} = props;
    let content_lim=200;
    let titles_list= a.title.split(' - ');
    let newspaper= titles_list[titles_list.length-1];
    let fixed_title="";
    let now = new Date();
    let pub = new Date(a.publishedAt);
    let dif = now.getTime()-pub.getTime();
    for(let i=0; i<titles_list.length-1;i++){
        fixed_title+=titles_list[i];
    }
    return (
        <div className={`col-${12/ncol} d-flex align-items-stretch`}>
            <Card itemScope itemType="http://schema.org/Collection">
            <div className="card-container">
                <Card.Link itemProp="url" href={a.url} target="_blank" rel="noopener noreferrer">
                    <Card.Img rel="preload" alt={`image from ${newspaper} for: ${fixed_title}`}itemProp="thumbnailUrl" src={a.urlToImage}/>
                </Card.Link>
                <Button itemScope itemType="https://schema.org/UpdateAction"
                        className="mt-auto" 
                        variant={(that.mlist[a._id])? "danger":"success"}
                        onClick={handleClick.bind(that)}
                >{(that.mlist[a._id])? " - ":"+"}</Button>
                <p itemProp="publisher" className="source" disabled>&nbsp;&nbsp;{newspaper}&nbsp;&nbsp;</p>
            </div>
            <Card.Body className="d-flex flex-column" >
                <Card.Title itemProp="title">
                    <OverlayTrigger placement="top" delay={{ show: 100, hide: 300 }} overlay={<Tooltip> {a.title}</Tooltip>}>
                        <a itemProp="url" href={a.url} target="_blank" rel="noopener noreferrer"><p>{`${fixed_title}`}</p></a>
                    </OverlayTrigger>
                </Card.Title>
                <Card.Text itemProp="abstract" className="p2 text-muted">
                    <LongText content={a.description} limit={content_lim}></LongText>
                </Card.Text>
            </Card.Body>
            <Card.Footer itemProp="datePublished">
                {lastUpdated(dif)}
            </Card.Footer>
            </Card>
        </div>
    );
}