import React from 'react';
import useProductsStore from '../stores/useStoreProducts';
import './styles/SearchForm.css'
import { Input } from 'antd';
import { useNavigate,useLocation } from 'react-router-dom';
const SearchForm = () => {
    const {findProducts} = useProductsStore()
    
       //si no estamos en la pantalla donde estan los productos vamos a ella
       const navigate  = useNavigate()
       const location  = useLocation()
    const onhandleInputChange = (event) => {


 

        
        if (location.pathname != '/') navigate('/')
            
        console.log(event.target.value)
        findProducts(event.target.value)
    }
    return (
        <div className='searchform'>
            <form type='submit'>
                <label for="gsearch">Buscar Productos</label>
                <Input type="search" id="gsearch" name="gsearch" onChange={(onhandleInputChange)}/>
            
            </form>

        </div>
    );
}

export default SearchForm;
