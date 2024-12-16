import React from 'react';
import './styles/AddressCard.css'
const AddressCard = (props) => {
  console.log('Llego props: ', props)

    
  return (
    <div className="address-card">
         {props.formatted_address && (
            <p><strong>{props.formatted_address}</strong></p>
        )}
        
    </div>
);
    
}

export default AddressCard;


/*

  <div className="address-card">
         {props.formatted_address && (
            <p><strong>{props.formatted_address}</strong></p>
        )}
        {props.route && props.street_number && (
            <p><strong>Calle:</strong> {props.route} {props.street_number}</p>
        )}
        {props.locality && (
            <p><strong>Localidad:</strong> {props.locality}</p>
        )}
        {props.state && (
            <p><strong>Provincia:</strong> {props.state}</p>
        )}
        {props.country && (
            <p><strong>País:</strong> {props.country}</p>
        )}
        {props.postal_code && (
            <p><strong>Código Postal:</strong> {props.postal_code}</p>
        )}
      
        {props.location && (
            <p><strong>Coordenadas:</strong> Lat: {props.location.lat}, Lng: {props.location.lng}</p>
        )}
    </div>

*/
