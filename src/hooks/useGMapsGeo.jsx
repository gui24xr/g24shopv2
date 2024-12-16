import React from 'react';
import axios from 'axios'
const useGMapsGeo = () => {


    async function getGeoDataFromQuery(query) {
        //recibo el array de resultados de gmaps
        const apiKey= "AIzaSyDynWu5J0GQ-uY2k5gvgg3rFTidaLe2rWk"
        const results = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`)

        //console.log('Array de resultado: ', results)
        const resultsArray = results.data.results

        const addressDataArray = []
        resultsArray.forEach((item,index) => {
            console.log('Resultado: ', index, 'Objeto:', item)
            const components = item.address_components

            const addressData = {};
            components.forEach(component => {
          
                const types = component.types;
                if (types.includes("street_number")) {
                  addressData.street_number = component.long_name;
                }
                if (types.includes("route")) {
                  addressData.route = component.long_name;
                }
                if (types.includes("locality")) {
                  addressData.locality = component.long_name;
                }
                if (types.includes("administrative_area_level_1")) {
                  addressData.state = component.long_name;
                }
                if (types.includes("country")) {
                  addressData.country = component.long_name;
                }
                if (types.includes("postal_code")) {
                  addressData.postal_code = component.long_name;
                }

                if (item.formatted_address) addressData.formatted_address = item.formatted_address
                if (item.geometry.location) addressData.location = item.geometry.location
            
              });
        
              console.log(addressData)
              addressDataArray.push(addressData)
              //habria que agregar a un array de coincidencias
        
        })
       console.log(addressDataArray)
       //Antes de retornarlo a cada resultado le vamos a poner un id
       
       return addressDataArray.map((item,index)=>({pointId:index,...item}))
       
      }

      const a = 4


    return (
        {getGeoDataFromQuery, a})
    
}

export default useGMapsGeo;
