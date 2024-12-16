import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ position }) => {
  const [markerPosition, setMarkerPosition] = useState([-34.61, -58.38]);

  const handleMapClick = (event) => {
    const { lat, lng } = event.latlng;
    console.log('Coordenadas del clic:', lat, lng);
    setMarkerPosition([lat, lng]);
  
  };

  const nuevoPunto = [-34.9770774, -58.3750762];

  const handleButtonClick = () => {
    setMarkerPosition(nuevoPunto);
    console.log('Nueva posición del marcador:', nuevoPunto);
  };

  return (
    <>
      <MapContainer 
        center={markerPosition} 
        zoom={13} 
        style={{ height: '500px', width: '70%' }} 
        onClick={handleMapClick} // Agrega el manejador de clics aquí
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={markerPosition}>
          <Popup>Marcador en: {markerPosition.join(', ')}</Popup>
        </Marker>
      </MapContainer>
      <button onClick={handleButtonClick}>Cambiar a nuevo punto</button>
    </>
  );
};

export default MapComponent;
