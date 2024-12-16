import { create } from "zustand";
import useCartsStore from "./useStoreCarts";
import useProfileStore from "./useStoreProfile";
import { DataService } from "../services/dataservice";


export const useOrdersStore = create ((set,get)=>({
    currentOrder:null,
    paymentsMethodsList:null,
    paymentMethod:null,
    shippingPointsList: null,
    loading: true,
    error: null,


    setCurrentOrder: async(orderId) => {
        //Pide la order Id y la Setea la info de la orden con la cual trabajaremos.
        try{
            const searchedOrder = await DataService.getOrderById({orderId:orderId})
            if (!searchedOrder) throw new Error('No se encontro la order solicitada.')

            return set({currentOrder: searchedOrder})
        }catch(error){
            console.log(error)
            return set({error:error})
        }

    },

    createOrder:async ()=>{
        //Crea la order, vacia el carro y la setea
        const currentUser = useProfileStore.getState().currentUser
        const currentCart = useCartsStore.getState().currentCart // Usando get() para acceder a currentCart

        if (!currentUser){
            //Si no hay user logurado actuamos con localstorage
            return
        }
        //Pido el cambio en la BD
        try{
            const createdOrder = await DataService.createOrder({userEmail:currentUser.email})
            //Debo setear la currentOrder para que el componente redirija para coordinar pago y envio
            useCartsStore.getState().setCart(currentCart.cartId)
            const setOrderAction = get().setCurrentOrder
            setOrderAction(createdOrder.orderId)
        }catch(error){
            console.log(error)
            throw error
        }
        
    },

    setPaymentsMethodsList:async()=>{
        //Setea los metodos de pago disponibles
        try{
            console.log('Seteano payme')
            const methods = await DataService.getPaymenthsMethods()
            return set({paymentsMethodsList:methods})
        }catch(error){
            console.log(error)
            set({error:error})
        }
    },

    setPaymenthMethod:({paymentMethod})=>{
        //Setea el metodo de pago de la currentOrder
        return set({paymentMethod:paymentMethod})
    }

}))