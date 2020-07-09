import React, { Component } from 'react';
import { Card, Button, Carousel, Tooltip, OverlayTrigger, Spinner } from "react-bootstrap";
import LongText from './LongText';
import {Context} from '../hooks/UserProfile';
import AlertPopup from '../AlertPopup';
import brokenImg from '../../images/brokenImg.png';


class Background extends Component{
    static contextType= Context;
    constructor(props) {
        super(props);
        this.max= parseInt(props.max)||Infinity;
        this.formatting= props.formatting || 0;
        this.loading=true;
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
        this.getNews().then(this.loading=false);
        if(this.formatting===0){
            window.addEventListener("scroll",this.handleScroll);
        }
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
        try{
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
        }catch{}
    };
    removeDupMerge(a1,a2) {
        let exists = {};
        a1.forEach(i=>exists[i._id]=true);
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
    addclick = (e,info)=>{
        e.preventDefault();
        let {nlist,mlist}= this;
        info.lat=0;
        info.lng=0;
        
        let i=0;
        let d2=new Date(info.publishedAt);
        if(nlist.length===0){
            nlist.push(info);
        }else if(mlist[info._id]){
            console.log("article already exists!");
            return;
        }else{
            mlist[info._id]=true;
            while(i<nlist.length){
                let d1= new Date(nlist[i].publishedAt);
                if(i===0 && d2<d1){
                    nlist.unshift(info);
                    break;
                }else if(d2<d1){
                    let result=[...nlist.slice(0,i),info,...nlist.slice(i,nlist.length)];
                    nlist=result;
                    break;
                }else if(i===nlist.length-1){
                    nlist.push(info);

                    break;
                }
                i++;
            }
        }
        this.nlist=nlist;
        let cpy=this.context[0].maps;
        cpy[this.current].data=nlist;
        this.context[1]({maps:cpy});
    }
    subclick = (e,info)=>{
        e.preventDefault();
        let {nlist}= this;
        let i= 0;
        let ind=-1;
        while(i<nlist.length){
            if(nlist[i]._id===info._id){
                ind=i;
                break;
            }
            i++
        }
        nlist.splice(ind,1);
        this.nlist=nlist;
        let cpy=this.context[0].maps;
        cpy[this.current].data=nlist;
        this.context[1]({maps:cpy});
    }
    lastUpdated = (ms)=>{
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
    render() {
        if(this.loading){
            return(<div className="loader"><br/><Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner></div>);
        }
        this.current= +window.localStorage.getItem("cur")||0;
        this.nlist=this.context[0].maps[this.current].data||[];
        this.mlist={};
        this.nlist.forEach(ele=>this.mlist[ele._id]=true);
        let that=this;
        let ncol= (this.props.size>=768) ? 3:1;
        let content_lim=200;
        let content=[];
        let subcontent=[];
        this.state.news.map((a,c) =>{
            let titles_list= a.title.split(' - ');
            let newspaper= titles_list[titles_list.length-1];
            let fixed_title="";
            let now = new Date();
            let pub = new Date(a.publishedAt);
            let dif = now.getTime()-pub.getTime();
            for(let i=0; i<titles_list.length-1;i++){
                fixed_title+=titles_list[i];
            }
            subcontent.push(
                <div key={a._id} className={`col-${12/ncol} d-flex align-items-stretch`}>
                    <Card id={a._id} itemScope itemType="http://schema.org/Collection">
                        <div className="card-container">
                            <Card.Link itemProp="url" href={a.url} target="_blank" rel="noopener noreferrer">
                                <Card.Img rel="preload" alt={`image from ${newspaper} for: ${fixed_title}`}itemProp="thumbnailUrl" src={a.urlToImage}/>
                            </Card.Link>
                            <Button itemScope itemType="https://schema.org/UpdateAction"
                                    className="mt-auto" 
                                    variant={(that.mlist[a._id])? "danger":"success"}
                                    onClick={(e)=>{
                                        let click=(that.mlist[a._id])? that.subclick.bind(that):that.addclick.bind(that);
                                        click(e,a);
                                    }}
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
                            {this.lastUpdated(dif)}
                        </Card.Footer>
                    </Card>
                </div>
            )
            if(c%ncol===ncol-1 ||c===that.state.news.length-1){
                if(this.formatting===1){
                    content.push(
                        <Carousel.Item key={""+a._id+c}>
                            <div className="d-flex flex-row mx-auto my-auto m cards">{subcontent}</div>
                            <br/>
                        </Carousel.Item>
                    )
                }else if(this.formatting===0){
                    content.push(
                        <React.Fragment key={""+a._id+c}>
                            <div className="d-flex flex-row cards">{subcontent}</div>
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
                    {(this.context[0].error)? <AlertPopup title={"Server Error!"} body={this.context[0].error} variant={"danger"}/>:null}
                </div>
            )
        }else if(this.formatting===1){
            return (
                <div id="news-inner" style={{width:this.props.size*.9+"px",height:"auto",marginLeft:"auto",marginRight:"auto",overflow:"hidden"}}>
                    <Carousel className="mx-auto" indicators={false} interval={9000}>
                        {content}
                    </Carousel>
                    {(this.context[0].error)? <AlertPopup title={"Server Error!"} body={this.context[0].error} variant={"danger"}/>:null}
                </div>
            )
        }
    }
    
}
export default Background;