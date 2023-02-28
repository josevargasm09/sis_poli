import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import Marker from "./Marker";
import DenunciaService from "../service/DenunciaService";
import { K_SIZE } from './my_great_place_with_hover_styles.js';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function SimpleMap(props) {
  const [show, setShow] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627
    },
    zoom: 11
  };
  
  const newfcut = (e) => {
    const data_complaint=props.data_complaint;
    data_complaint(e)
}
        


  const onChildMouseEnter = (key) => {
    let _complaints = [...complaints];
    const index = findIndexById(key);
    let complaint = complaints.filter(val => val.id == key);
    let obje = complaint[0];
    obje.flag = true;
    _complaints[index]=obje;

    setComplaints(_complaints);
  
  
  }
  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < complaints.length; i++) {
      if (complaints[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }
  const onChildMouseLeave = (key) => {
    let _complaints = [...complaints];
    const index = findIndexById(key);
    let complaint = complaints.filter(val => val.id == key);
    let obje = complaint[0];
    obje.flag = false;
    _complaints[index]=obje;

    setComplaints(_complaints);
  }
  const data_complaint_new = () => {
    console.log('algo');
  }
  useEffect(() => {
    async function fetchDataComplaint() {
      const res = await DenunciaService.list();
      console.log(res.data);
      setComplaints(res.data)
    }
    fetchDataComplaint();
  }, []);

  return (
    <div style={{ width: '100%', height: '72vh' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyBwq9jkLCmf8oHecoIGu0Hp7l1OC9uoUfM" }}
        defaultCenter={{
          lat: -6.4830738240872705,
          lng: -76.37364869037867,
        }}
        defaultZoom={14}
        onChildMouseEnter={onChildMouseEnter}
        onChildMouseLeave={onChildMouseLeave}
      >
        {complaints.map(marker => (

          <Marker
            text={"hola"}
            lat={marker.latitudHecho}
            lng={marker.longitudHecho}
            color={marker.color_report}
            key={marker.id}
            complaint={marker}
            data_complaint={newfcut}
            isShown={marker.flag}
          />
        ))}


      </GoogleMapReact>
    </div>
  );
}