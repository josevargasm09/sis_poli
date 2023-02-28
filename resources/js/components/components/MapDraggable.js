import React, { useState } from "react";
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
const MapDraggable = (props) => {
    const [complaint, setComplaint] = useState(props.complaint);
    let markersList = [
        {
            lat: complaint.latitudDefault,
            lng: complaint.longituDefault,
        }

    ]
    let [markers, setMarkers] = useState(markersList);
    const mapStyles = {
        width: '100%',
        height: '100%'
    };
    let onMarkerDragEnd = (coord, index, markers) => {

        const { latLng } = coord;

        const lat = latLng.lat();
        const lng = latLng.lng();


        

        markers[index] = { lat, lng };
        console.log(lat, lng);
        console.log('coordenadas');
        setMarkers(markers);

        const onInputChangeMap = props.onInputChangeMap;
        onInputChangeMap(lat, lng);
    }


    let myMarkers = Object.entries(markers).map(([key, val]) => (
        <Marker key={key} id={key} position={{
            lat: val.lat,
            lng: val.lng
        }}
            draggable={true}
            onDragend={(t, map, coord) => onMarkerDragEnd(coord, key, markers)} />
    ))


    return (


        <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
            <Map
                google={props.google}
                zoom={15}
                style={mapStyles}
                initialCenter={
                    {
                        lat: complaint.latitudDefault,
                        lng: complaint.longituDefault,
                    }
                }
            >
                {myMarkers}
            </Map>
        </div>



    );
}


export default GoogleApiWrapper({
    apiKey: 'AIzaSyBwq9jkLCmf8oHecoIGu0Hp7l1OC9uoUfM'
})(MapDraggable);