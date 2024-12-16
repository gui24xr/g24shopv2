import React, { useEffect,useState } from 'react';

//Este hook me provee de la ubicacion actual
const useMyPosition = () => {

    const [loading,setLoading] = useState(true)
    const [error,setError] = useState(null)
    const [ubication,setUbication] = useState(null)

    function success(position) {
   
       setUbication({
        latitude:position.coords.latitude, 
        longitude : position.coords.longitude
        })
        setLoading(false)
      }
      
   function getUbication(){
    console.log('Se ejecuto getUbication: ')
    setLoading(true)
    navigator.geolocation.getCurrentPosition(success, ()=>{
        setError(error)
    console.error('No se pudo obtener la ubicación.');
    setLoading(false)
    })
   }

    useEffect(()=>{
      getUbication()
       
    },[])

    return {getUbication,ubication,loading,error}
}

export default useMyPosition;
