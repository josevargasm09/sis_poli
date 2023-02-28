// Marker.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
position: absolute;
top: 50%;
left: 50%;
width: 18px;
height: 18px;
background-color:  ${(props) => (props.color)};
border: 2px solid #fff;
border-radius: 100%;
user-select: none;
transform: translate(-50%, -50%);
cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
&:hover {
  z-index: 1;
}
`;

const Info = styled.div`
    position: absolute,
    width: 80px,
    color: red,
    background: red,
   
    
`;

   
const Marker = ({ text, onClick, isShown,key,color,complaint,data_complaint}) => (
  
  <div key={key}>
    {isShown && (
      <div className="tooltips_span">
        <span><strong>{complaint.modality_description}</strong></span><br />
        <span>Tipo: {complaint.type_complaint_description}</span>
        <span>Sección: {complaint.seccion_description}</span>
        <span>Libro: {complaint.book_description}</span>
      </div>
    )}

    <Wrapper
      alt={text}
      color={color}
      onMouseEnter={onClick}
      onClick={(e) => data_complaint(complaint.id)}
    />
    

  </div>
);

Marker.defaultProps = {
  onClick: null,
};

Marker.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string.isRequired,
};

export default Marker;