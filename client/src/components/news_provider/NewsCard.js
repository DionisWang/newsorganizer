import React from 'react';
import { Card, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import LongText from './LongText';
import LazyImage from './LazyImage';
import {fixTitle, lastUpdated} from '../../utils/help'


export default function NewsCard(props) {
    let {a,handleClick,that,ncol} = props;
    let content_lim=200;
    
    let {newspaper,fixed_title}= fixTitle(a.title);
    return (
        <div className={`col-${12/ncol} d-flex align-items-stretch`}>
            <Card itemScope itemType="http://schema.org/Collection">
            <div className="card-container">
                <Card.Link itemProp="url" href={a.url} target="_blank" rel="noopener noreferrer">
                    <LazyImage newspaper={newspaper} fixed_title={fixed_title} urlToImage={a.urlToImage}/>
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
                {lastUpdated(a.publishedAt)}
            </Card.Footer>
            </Card>
        </div>
    );
}