import React, { Component } from 'react';
import {Map, GoogleApiWrapper, Marker} from 'google-maps-react'


class World extends Component{
    
    render(){
        return (
            <Map
                google={this.props.google}
                zoom={2}
                mapTypeControl={false}
                streetViewControl={false}
                style={{width: "90%", height: "80%"}}
            />
        )
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAWW9H-zCDloCTL_AnTYYXmIQOP08GkFXM'
})(World);