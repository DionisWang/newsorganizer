import React, { Component } from 'react';
import {Context} from '../hooks/UserProfile';
import { Spinner, Table } from "react-bootstrap";
import {fixTitle} from '../../utils/help'
import MapList from '../map_list/MapList';
import { faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class TableManager extends Component {
    static contextType= Context;
    constructor(props) {
        super(props);
        this.shown={};
        this._isMounted=false;
        this.state={
            current:+window.localStorage.getItem("cur")||0,
            criteria:[-1,-1],
        }
    }
    
    componentDidMount() {
        
    };
    componentWillUnmount(){
    };
    handleClick(col){
        if(this.state.criteria[0]===col){
            this.setState({criteria: [col,-this.state.criteria[1]]});
        }else{
            this.setState({criteria: [col,1]});
        }
        console.log("clicked");
    };
    strCmp(a,b,asc){
        let x = a.toUpperCase();
        let y = b.toUpperCase();
        return x<y ? -asc : x>y ? asc : 0;
    };
    dateCmp(a,b,asc){
        let x = new Date(a);
        let y = new Date(b);
        return (x-y)*asc;
    };
    loadInfo(map_num){
        this.nlist=this.context[0].maps[(map_num||map_num===0)?map_num:this.state.current].data||[];
        let {nlist}=this;
        let {criteria} = this.state;
        let col= criteria[0];
        let asc= criteria[1];
        let cpy= [...nlist];
        cpy.sort((a,b)=>{
            if(col===0){
                return this.strCmp(a.title,b.title,asc);
            }else if(col === 1){
                return this.strCmp(a.source,b.source,asc);
            }else if(col === 2){   
                return this.dateCmp(a.publishedAt,b.publishedAt,asc);
            }
            return 0;
        });
        let content=[];
        cpy.forEach((info,i)=>{
            let {newspaper, fixed_title} = fixTitle(info.title);
            content.push(
                <tr key={info._id+"table"}>
                    <td> {i+1}</td>
                    <td><a href={info.url}>{fixed_title}</a></td>
                    <td>{info.description}</td>
                    <td>{newspaper}</td>
                    <td>{this.toFormat(info.publishedAt)}</td>
                </tr>
            )
        });
        return (<Table id="article-table" striped bordered hover size="sm" variant="Secondary">
                    <thead key="heading" style={{textAlign:"center"}}>
                        <tr>
                            <th style={{width:"35px"}}> # </th>
                            <th>Name <FontAwesomeIcon icon={faSort} onClick={(ev)=>{ev.preventDefault();this.handleClick(0)}}/></th>
                            <th>Excerpt</th>
                            <th style={{width:"80px"}}>Source <FontAwesomeIcon icon={faSort} onClick={(ev)=>{ev.preventDefault();this.handleClick(1)}}/></th>
                            <th style={{width:"120px"}}>Date Posted <FontAwesomeIcon icon={faSort} onClick={(ev)=>{ev.preventDefault();this.handleClick(2)}}/></th>
                        </tr>
                    </thead>
                    <tbody>
                        {content}
                    </tbody>
                </Table>
        );
    }
    
    toFormat (v) {
        return new Date(v).toLocaleString();
    }
    handleSave(){
        this.context[1](this.context[0],{isLoaded:false});
    }
    handleCurrent(e){
        this.loadInfo(e);
        this.setState({current:e, criteria:[-1,-1]});
    }
    componentDidUpdate(){
        if(this.context[0].mapLoaded){
            this.loadInfo();
        }
    }
    
    render() {
        return (
        <div style={{width:"90%", margin:"0 auto"}}>
            <MapList cstUpdate={this.handleCurrent.bind(this)}></MapList>
            <br/>
            {(true)?this.loadInfo():<div className="loader"><br/><Spinner animation="border" role="status">
            <span className="sr-only">Loading Table...</span>
          </Spinner></div>}
        </div>
        )
    }

}
export default TableManager