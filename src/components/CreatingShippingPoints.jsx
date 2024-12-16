import React ,{useState, useEffect}from 'react'
import { MapComponent, SearchLocations, AddressAutocomplete } from './components.index';


const CreatingShippingPoints = () => {
    
    const [selectedPoint, setSelectedPoint] = useState(null)
    const [markerPosition,setMarkerPosition] = useState([-34.61, -58.38])
    
    useEffect(()=>{
        console.log('Punto Elegisdo a: ', selectedPoint)

        if (selectedPoint){
            console.log('Punto elegido b: ',selectedPoint)
            setMarkerPosition(selectedPoint.location)
        }
    
    },[selectedPoint])


    return (
        <div>
            <AddressAutocomplete/>
            <SearchLocations setSelectedPoint={setSelectedPoint}/>
           
            <MapComponent position={markerPosition}/>
          
        </div>
    );
}

export default CreatingShippingPoints;
