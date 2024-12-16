import React from 'react';
import { Button } from 'antd';
import { useOrdersStore } from '../stores/useStoreOrders';
import { useNavigate } from 'react-router-dom';


const CreateOrderButton = () => {

    const {createOrder} = useOrdersStore()
    const navigate = useNavigate()
    const handleClick = () =>{
        alert('Vamos a comprar')
        createOrder() //Esto del store crea la compra, setea la current asique ya podria redirigr a la pantalla de la currentOrder
        navigate('/order')
    } 
    return (
        <>
          <Button
            shape='default'
            onClick={handleClick}
          >Comprar </Button>  
        </>
    );
}

export default CreateOrderButton;
