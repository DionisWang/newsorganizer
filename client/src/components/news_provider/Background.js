import React, { Component } from 'react';
import { Card, Button, Carousel, Tooltip, OverlayTrigger } from "react-bootstrap";
import LongText from './LongText';
import {Context} from '../hooks/UserProfile';

class Background extends Component{
    static contextType= Context;
    constructor(props) {
        super(props);
        this.max= parseInt(props.max)||Infinity;
        this.formatting= props.formatting || 0;
        const params = new URLSearchParams(window.location.search);

        this.state={
            news:[],
            per: this.max,
            offset: 0,
            query: params.get('q') || "",
            page: 1,
            prevState: null,
        };
    }
    componentDidMount(){
        window.addEventListener('popstate', this.handleSearch);
        this.getNews();
        if(this.formatting===0){
            window.addEventListener("scroll",this.handleScroll);
        }
        this.nlist=this.context[0].maps[0].data||[];
    }
    componentWillUnmount(){
        window.removeEventListener("scroll", this.handleScroll);
        window.removeEventListener("popstate", this.handleSearch);
    }
    getNews = async () => {
        const {news, query, per, page,offset} = this.state;
        const url = `/api/news?search=${query}&limit=${per}&page=${page}&offset=${offset}`;
        const response = await fetch(url,{
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'same-origin', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            referrerPolicy: 'no-referrer', // no-referrer, *client
          });
        const body = await response.json();
        if (response.status !== 200){
            throw Error(body.message);
        }
        if(body.articles.length===0){
            window.removeEventListener("scroll", this.handleScroll);
        }else if(body.articles.length<per){
            this.setState({
                news: this.removeDupMerge(news,body.articles),
                scrolling: false,
                offset: per-body.articles.length,
            });
        }else{
            this.setState({
                news: this.removeDupMerge(news,body.articles),
                scrolling: false,
            });
        }
    };
    removeDupMerge(a1,a2) {
        let exists = {};
        a1.forEach(i=>{
            exists[i._id] =true;
        });
        a2.forEach(i=>{
            if(!exists[i._id]){
                a1.push(i);
            }
        });
        return a1;
    };
    loadMore = () => {
        if (!this.state.scrolling){
            this.setState(
                prevState => ({
                    page: prevState.page + 1,
                    scrolling: true
                }),
                this.getNews
            );
        }
    };
    handleScroll = () => {
        var d = document.documentElement;
        var offset = d.scrollTop + window.innerHeight;
        var height = d.offsetHeight;
        if (offset+200 >= height) {
            this.loadMore();
        }
    };
    handleSearch = () =>{
        if(this.formatting===0){
            window.addEventListener("scroll",this.handleScroll);
        }
        this.setState({
            query: new URLSearchParams(window.location.search).get('q'),
            news:[],
            page:1,
            offset: 0,
            prevState:null,
        },()=>{
            this.getNews();
        });
    }
    render() {
        let that=this;
        let ncol= (this.props.size>=768) ? 3:1;
        let content_lim=(this.props.size/15);
        let content=[];
        let subcontent=[];
        this.state.news.map((a,c) =>{
            let addclick=function(e){
                let info=a;
                info.lat=0;
                info.lng=0;
                e.preventDefault();
                let i=0;
                let d2=new Date(info.publishedAt);
                if(that.nlist.length===0){
                    that.nlist.push(info);
                }else{
                    while(i<that.nlist.length){
                        if(that.nlist[i]._id===info._id){
                            console.log("article already exists!");
                            break;
                        }
                        let d1= new Date(that.nlist[i].publishedAt);
                        if(i===0 && d2<d1){
                            that.nlist.unshift(info);
                            break;
                        }else if(d2<d1){
                            let result=[...that.nlist.slice(0,i),info,...that.nlist.slice(i,that.nlist.length)];
                            that.nlist=result;
                            break;
                        }else if(i===that.nlist.length-1){
                            that.nlist.push(info);
                            break;
                        }
                        i++;
                    }
                }
                let cpy=that.context[0].maps;
                cpy[0].data=that.nlist;
                that.context[1]({maps:cpy});
            }
            subcontent.push(
                <div key={a._id} className={`col-${12/ncol} d-flex align-items-stretch`}>
                    <Card id={a._id}>
                        <Card.Link href={a.url} target="_blank" rel="noopener noreferrer"><Card.Img variant="left" src={a.urlToImage}/></Card.Link>
                        <Card.Body className="d-flex flex-column" >
                            <Card.Title>
                                <OverlayTrigger placement="top" delay={{ show: 100, hide: 300 }} overlay={<Tooltip> {a.title}</Tooltip>}>
                                    <a href={a.url} target="_blank" rel="noopener noreferrer"><p>{`${a.title}`}</p></a>
                                </OverlayTrigger>
                            </Card.Title>
                            <Card.Text className="p2 text-muted">
                                <LongText content={a.description} limit={content_lim}></LongText>
                            </Card.Text>
                            <Button className="mt-auto" variant="primary" onClick={addclick}>Add To Timeline</Button>
                        </Card.Body>
                    </Card>
                </div>
            )
            if(c%ncol===ncol-1 ||c===that.state.news.length-1){
                if(this.formatting===1){
                    content.push(
                        <Carousel.Item key={""+a._id+c}>
                            <div id="cards" className="d-flex flex-row w-75 mx-auto my-auto m">{subcontent}</div>
                            <br/>
                        </Carousel.Item>
                    )
                }else if(this.formatting===0){
                    content.push(
                        <React.Fragment key={""+a._id+c}>
                            <div id="cards" className="d-flex flex-row">{subcontent}</div>
                        </React.Fragment>
                    )
                }
                subcontent=[];
            }
            return true;
        })
        if(this.formatting===0){
            return (
                <div id="news-inner">
                    <div className="d-flex flex-wrap mx-1">
                        {content}
                    </div>
                </div>
            )
        }else if(this.formatting===1){
            return (
                <div id="news-inner" style={{width:this.props.size*.9+"px",height:"475px",marginLeft:"auto",marginRight:"auto",overflow:"hidden"}}>
                    <Carousel className="mx-auto" indicators={false}>
                        {content}
                    </Carousel>
                </div>
            )
        }
    }
    
}
export default Background;