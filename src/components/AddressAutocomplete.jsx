import React,{useState,useEffect} from 'react';
import useGMapsGeo from '../hooks/useGMapsGeo';
import {  AddressCard } from './components.index';
import "./styles/AddressAutocomplete.css"

const AddressAutocomplete = () => {

    const {getGeoDataFromQuery} = useGMapsGeo()
    const [text,setText]=useState('')
    const [matchesArray,setMachesArray] = useState([])


    const doQuery = async(query) => {
        try{
            const results = await getGeoDataFromQuery(query)
            setMachesArray(results)
        }catch(error){
            console.log(error)
            throw error
        }
    
        
    }

    useEffect(()=>{
        if (text){
            console.log(text)
            doQuery(text)
        }
    },[text])

    const onCardClick = (itemInfo) => {
        alert('dsff')
        console.log('Tarjeta clickeada: ', itemInfo)
    }
       
   

    return (
        <div>
           <input type='text' value={text} onChange={(e)=>setText(e.target.value)}/> 
          <div className='address-selector-wrap'>
          {matchesArray?.map(item => (<AddressCard {...item}/>))}
          </div>
          
        </div>
    );
}

export default AddressAutocomplete;
