import React,{useState,useEffect} from 'react';
import { AutoComplete,Input } from 'antd';
import axios from 'axios'
import useGMapsGeo from '../hooks/useGMapsGeo';

/* Tengo que, cada vez que cambie el search poner en options un array con {value: valor de la opcion, label:jsx que muestra la data}*/

const SearchLocations = ({setSelectedPoint}) => {
    
  const {getGeoDataFromQuery} = useGMapsGeo()
    const [options,setOptions] = useState([])
    const [optionsArray, setOptionsArray] = useState([]) //para contrarstar el valoe del elegido
    //const [selectedPoint, setSelectedPoint] = useState(null)

/*
    useEffect(()=>{
        console.log('Punto Elegisdo: ', selectedPoint)
    },[selectedPoint])
*/

    const onSelect = (value) => {
        console.log('Se selecciono: ', value)
        //Lo contrasto con el options array para saber que datos debo representar y eso lo meto en la variable de datos elegido
        console.log('En on select options arayt: ', optionsArray)
        const pointIndex = optionsArray.findIndex(item => item.pointId == value)
        setSelectedPoint(optionsArray[pointIndex])
    }


    const getOptionsArray = (resultsList) =>{
        //Array de opciones con el formato necesario

        return resultsList.map( item => ({
            value: item.pointId,
            label:(<span>{item.formatted_address}</span>)

        }))
      
    }

/*
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
       //console.log(addressDataArray)
       //Antes de retornarlo a cada resultado le vamos a poner un id
       
       return addressDataArray.map((item,index)=>({pointId:index,...item}))
       
      }

    */
    const handleSearch = (query) => {
        console.log('Cambio el query: ', query)
        //Cambio el query tengo que buscar las opciones y con esas opciones construir un array para darle a set options.
        if (query.length >= 5){

            getGeoDataFromQuery(query)
            .then(res => {
                console.log('Array recibido: ', res)
                const optionsArray = getOptionsArray(res)
                console.log('Options array: ',optionsArray)
                setOptionsArray(res)
                setOptions(res ? optionsArray: [])
            })
            .catch(err => console.log(err))
           
          
        }
    }


    return(
        <>
        <AutoComplete
            popupMatchSelectWidth={252}
            style={{width: 300,}}
            size="large"
            options={options}
            onSelect={onSelect}
            onSearch={handleSearch}
            
          >
            <Input size="large" placeholder="input here" enterButton />

          </AutoComplete>
        </>
    )
}

export default SearchLocations;
