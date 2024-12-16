import React, { useEffect, useState } from 'react';
import { useOrdersStore } from '../stores/useStoreOrders';
import { Space, Table, Tag } from 'antd';
import { Card, Col, Row } from 'antd';


const OrderPanel = () => {


    const {currentOrder, paymentsMethodsList, setPaymenthMethod, paymentMethod} = useOrdersStore()


    useEffect(()=>{
        if(!paymentsMethodsList) useOrdersStore.getState().setPaymentsMethodsList()
    },[])



    console.log('Current Order en info panel: ', currentOrder)
    console.log('paymentsmethodList: ', paymentsMethodsList)

    const OnSelectPaymentMethod = (paymentMethod) =>{
        console.log('Metodo de pago seleccionado: ', paymentMethod)
        setPaymenthMethod({paymentMethod:paymentMethod})
      
    }
    return (
        <div>
            <div>


            </div>
            <table className="cartcontainer-table">

                <thead>
                    <tr>

                        <th>Title</th>
                        <th>Brand</th>
                        <th>Unit Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>

                        
                    </tr>
                </thead>
                <tbody>
                    
                    {currentOrder?.detail.map((product) => (
                        <tr key={product.productId}>
                          
                            <td>{product.title}</td>
                            <td>{product.brand}</td>
                            <td>${product.price}</td>
                            <td>${product.quantity}</td>
                            <td>${product.subTotalAmount}</td>
                          
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <p>Forma de pago.</p>
                <Row gutter={16}>
                    {paymentsMethodsList?.map(item => (
                    <Col span={8} key={item.id}>
                        <Card title={item.name}  style={paymentMethod?.id == item.id &&{ border: '1px solid cyan' }}  bordered={false} onClick={()=>OnSelectPaymentMethod(item)}>
                            {item.description}
                        </Card>
                    </Col>
                    ))}
                </Row>
            </div>

        </div>
      
    );
}

export default OrderPanel;
