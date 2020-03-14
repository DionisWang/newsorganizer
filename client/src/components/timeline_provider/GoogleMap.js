import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Nouislider from 'react-nouislider';

import {Context} from '../hooks/UserProfile';
import GoogleMapSaveButton from './GoogleMapSaveButton';
import MapList from '../map_list/MapList';
import AlertPopup from '../AlertPopup';
import './nouislider.css';

let gmap=null;
if(!window.google){
}else{
    gmap= window.google.maps;
    gmap.InfoWindow.prototype.isOpen = function(){
        var map = this.getMap();
        return (map !== null && typeof map !== "undefined");
    }
}
//journal(database), hashtags, multiple timelines, search bar in the middle,
class GoogleMap extends Component {
    static contextType= Context;
    googleMapRef = React.createRef();
    shown={};
    _isMounted=false;
    state={
        current:+window.localStorage.getItem("cur")||0,
    }
    componentDidMount() {
        this.googleMap = this.createGoogleMap();
    };
    componentWillUnmount(){
        this.shown={};
    }
    loadmarks(map_num){
        this.nlist=this.context[0].maps[(map_num||map_num===0)?map_num:this.state.current].data||[];
        let {shown,nlist}=this;
        //let c=0;
        nlist.forEach((info)=>{
            if(!shown[info._id]){
                //c++;
                shown[info._id]=this.createMarker(info);
                //setTimeout(()=>{shown[info._id].setMap(googleMap)}, 5000*c);
            }
        });
    }
    checkbounds(){
        let north= this.googleMap.getBounds().getNorthEast().lat();
        let south= this.googleMap.getBounds().getSouthWest().lat();
        if(north>85 ||south<-85){
            this.googleMap.setCenter(this.center);
        }else{
            this.center=this.googleMap.getCenter();
        }
    }
    createGoogleMap = () =>{
        this.center=new gmap.LatLng(0,0);
        let map= new gmap.Map(this.googleMapRef.current, {
            zoom: 2,
            center: this.center,
            minZoom: 2, 
            maxZoom: 15,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            disableDoubleClickZoom: true,
            gestureHandling: 'greedy',
        })
        //let that=this;
        map.addListener("bounds_changed",this.checkbounds.bind(this), {passive: true});
        /*map.addListener("dblclick",function(e){
            that.nlist.push({_id:1000-that.nlist.length,title:"N/A",description:"N/A",lat:e.latLng.lat(),lng:e.latLng.lng()});
            let cpy= that.context[0].maps;
            cpy[0].data=that.nlist
            that.context[1]({maps:cpy});
        });*/
        return map;
    }
    
    createMarker = (info) =>{
        let {url,title,description,lat,lng}=info;
        let that=this;
        let marker= new gmap.Marker({
            position: { lat: lat, lng: lng },
            animation: gmap.Animation.DROP,
            draggable: true,
            title: title,
            map: this.googleMap,
        });
        let infowindow = new gmap.InfoWindow({
            content: `
                <div class="pin">
                    <a class="pin-a"href=${url}>
                        <h1 class="pin-h1">${title}</h1>
                    </a>
                    <p class="pin-p text-muted">${description}</p>
                </div>`,
        });
        marker.addListener('click', () => {
            (!infowindow.isOpen())? infowindow.open(marker.get('map'), marker): infowindow.close();
        }, {passive: true});
        marker.addListener('rightclick', (e)=> {
            let {nlist}=that;
            let ind= nlist.map(e => e._id).indexOf(info._id);
            marker.setMap(null);
            nlist.splice(ind,1);
            let cpy= that.context[0].maps;
            cpy[that.state.current].data=that.nlist
            that.context[1]({maps:cpy});
            delete that.shown[info._id];
        }, {passive: true});
        marker.addListener('dragend', function(e) {
            let {nlist}=that;
            let ind= nlist.map(e => e._id).indexOf(info._id);
            nlist[ind].lat=e.latLng.lat();
            nlist[ind].lng=e.latLng.lng();
            let cpy= that.context[0].maps;
            cpy[that.state.current].data=that.nlist
            that.context[1]({maps:cpy});
        }, {passive: true});
        return marker;
    }
    toFormat (v) {
        return new Date(v).toLocaleString();
    }
    handleSave(){
        this.context[1](this.context[0],{isLoaded:false});
    }
    handleCurrent(e){
        for(let id in this.shown){
            this.shown[id].setMap(null);
        }
        this.shown={};
        this.loadmarks(e);
        this.setState({current:e},()=>{
            let controlDiv = document.createElement('div');
            controlDiv.index = 1;
            ReactDOM.render(<GoogleMapSaveButton 
                    user={(this.context[0].user)? true:false} 
                    handleSave={this.handleSave.bind(this)}
                    baseName={this.context[0].maps[this.state.current].name}
                />
            ,controlDiv);
            this.googleMap.controls[gmap.ControlPosition.TOP_RIGHT].pop();
            this.googleMap.controls[gmap.ControlPosition.TOP_RIGHT].push(controlDiv);
        });
    }
    componentDidUpdate(){
        this.loadmarks();
        if(this.context[0].isLoaded&&!this._isMounted){
            let controlDiv = document.createElement('div');
            controlDiv.index = 1;
            ReactDOM.render(<GoogleMapSaveButton 
                    user={(this.context[0].user)? true:false} 
                    handleSave={this.handleSave.bind(this)}
                    baseName={this.context[0].maps[this.state.current].name}
                />
            ,controlDiv);
            this.googleMap.controls[gmap.ControlPosition.TOP_RIGHT].push(controlDiv);
            this._isMounted=true;

        }
    }
    loadDateFilter(){
        let {shown,nlist}=this;
        if(nlist.length===0){
            return null;
        }
        let min= new Date(nlist[0].publishedAt);
        let max= new Date(nlist[nlist.length-1].publishedAt);
        return (
            <div style={{width:"50%",display:"inline-block"}}>
            <Nouislider
                    range={{min: min.getTime()-1000, max: max.getTime()+1000}}
                    connect={[false,true,false]}
                    step={1000}
                    start={[min.getTime()-1000, max.getTime()+1000]}
                    tooltips
                    format= {{ to: this.toFormat, from: Number }}
                    onUpdate={(values)=> {
                        let min = new Date(values[0]);
                        let max= new Date(values[1]);
                        nlist.forEach(info=>{
                            let pin=shown[info._id];
                            if(pin){
                                let pin_date= new Date(info.publishedAt);
                                if(pin_date<min||pin_date>max){
                                    pin.setMap(null);
                                }else{
                                    pin.setMap(this.googleMap);
                                }
                            }
                        });
                        let date_range=document.querySelector(".DateRange");
                        date_range.innerHTML=`(Date Filter) From: ${min.toLocaleString()} to ${max.toLocaleString()}`;
                    }}
            />
            </div>
        )
    }
    render() {
        return (
        <div style={{width: this.props.width, height: this.props.height, display:"inline-block"}}>
            <MapList cstUpdate={this.handleCurrent.bind(this)}></MapList>
            {(gmap)? <div
                id="google-map"
                ref={this.googleMapRef}
                style={{width: this.props.width, height: this.props.height, display:"inline-block"}}
            />: <AlertPopup variant="danger" title="Failed to load GoogleMap" body="Could not download GoogleMap"/>}
            <p/>
            <div style={{width:"100%", textAlign:"center"}}>
                <p className="DateRange"/>
                {(this._isMounted)?this.loadDateFilter():null} 
            </div>
        </div>
        )
    }
}
export default GoogleMap