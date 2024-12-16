import React from 'react';
import useCartsStore from '../stores/useStoreCarts';
import ClearCartButton from './ClearCartButton';
import { SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons';

import './styles/CartWidget.css'
import { NavLink } from 'react-router-dom';

const CartWidget = () => {

    const {currentCart} = useCartsStore()


    return (
        <div className="cart-widget">
                <NavLink to={'/cart'}> <ShoppingCartOutlined style={{ fontSize: '36px', color: 'red' }} /></NavLink>
             
              <p>Productos: {currentCart?.productsQuantity}</p>
              <p>Monto:{currentCart?.amount}</p>
              <ClearCartButton/>
      </div>
    );
}

export default CartWidget;

/*
return (
    <div>
        <p>CARRITO</p>
        <p>Productos: {currentCart?.productsQuantity}</p>
        <p>Monto:{currentCart?.amount}</p>
        <ClearCartButton/>

    </div>
);
*/