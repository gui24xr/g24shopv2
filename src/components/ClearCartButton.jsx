import React from 'react';
import useCartsStore from '../stores/useStoreCarts';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Divider, Flex, Radio, Space, Tooltip } from 'antd';

const ClearCartButton = () => {
    const {clearCart} = useCartsStore()

    const onHandleClearButton = () => {
        clearCart()
    }

    return (
        <div>
       
            <Button shape="round" size="large" onClick={onHandleClearButton}>
            Limpiar Carrito
             </Button>
        </div>
    );
}

export default ClearCartButton;

/*
  <div>
            <button type="button" onClick={onHandleClearButton}> -- Vaciar carrito -- </button>
        </div>
*/