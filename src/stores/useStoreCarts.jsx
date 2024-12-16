import { create } from "zustand";
import { DataService } from "../services/dataservice";
import  useProfileStore from "./useStoreProfile";

const useCartsStore = create ((set,get)=>({
    currentCart: null, //Por ahora empieza null, mas tarde usamos la logica del localStorage si no hay user logueado.
    loading: true,
    error: null,

    setCart: async (cartId) => {
        //Voy a recibir una cartInfo, pedirle al repo o server de carts el cart correspondiente para setear.
        if (!cartId){
            //if !cartId aca pongo lo del storage
            set({currentCart:null})
            return
        }
        //Si vino un cartId lo pido a la base de datos y lo seteo en currentCart.
        try{
            const searchedCart = await DataService.getCartById({cartId:cartId})
        
            if (!searchedCart) throw new Error('No se encontro un carro...')
            return set({currentCart:{
                cartId: searchedCart.cartId,
                products: searchedCart.products,
                amount: searchedCart.amount,
                productsQuantity: searchedCart.productsQuantity
              }})
        }catch(error){
            return set({error:error})
        }

    },

    clearCart: async() =>{
        const currentCart = get().currentCart; // Usando get() para acceder a currentCart
        
        if (!currentCart){
            //Agregamos al localStorage el producto
            //ponemos el products de localStorage en currentCart.Products xq en teolria siempre habra carro, ahora no hay xq no confifure lo del storage
            console.log('vacio el carro de localstorae')
            //Aca se ejecuta la funcion que agrega a localstorage
            return
        }
        //Si hay currentCart actuo sobre el
        try{
            await DataService.clearCart({cartId:currentCart.cartId})
           //Ahora como la BD fue actualizada hacemos setCart con el cartId del mismo carro. Tengamos en cuenta que setCart Busca el carro en la base de datos y lo actualiza en el currentCart...
            const setCartAction = get().setCart
            setCartAction(currentCart.cartId)
        }catch(error){
            console.log(error)
            return set({error:error})
        }
    },

    //Accion para agregar prdpducto al carro:
    addProductToCart: async ({productId,quantity}) =>{
        const currentCart = get().currentCart; // Usando get() para acceder a currentCart
  
        if (!currentCart){
            //Agregamos al localStorage el producto
            //ponemos el products de localStorage en currentCart.Products xq en teolria siempre habra carro, ahora no hay xq no confifure lo del storage
            console.log('Entro x no cartId entonces ira al carro de local storage')
            //Aca se ejecuta la funcion que agrega a localstorage
            return
        }
        //Si hay cart id modificamos ese cart en la bD, lo traemos y actualizamos.
        try{
            await DataService.addProductToCart({
                cartId:currentCart.cartId,
                productId:productId,
                quantity: quantity
            })
            //Ahora como la BD fue actualizada hacemos setCart con el cartId del mismo carro. Tengamos en cuenta que setCart Busca el carro en la base de datos y lo actualiza en el currentCart...
            const setCartAction = get().setCart
            setCartAction(currentCart.cartId)
        }catch(error){
            console.log(error)
            return set({error:error})
        }
            
    },
    deleteProductToCart: async ({productId}) =>{
        const currentCart = get().currentCart; // Usando get() para acceder a currentCart
        if (!currentCart){
            //Agregamos al localStorage el producto
            //ponemos el products de localStorage en currentCart.Products xq en teolria siempre habra carro, ahora no hay xq no confifure lo del storage
            console.log('Entro x no cartId entonces opero obre carro de local storage')
            //Aca se ejecuta la funcion que agrega a localstorage
            return
        }
        //Si hay cart id modificamos ese cart en la bD, lo traemos y actualizamos.
        try{
            await DataService.deleteProductFromCart({
                cartId:currentCart.cartId,
                productId:productId,
            })
           //Ahora como la BD fue actualizada hacemos setCart con el cartId del mismo carro. Tengamos en cuenta que setCart Busca el carro en la base de datos y lo actualiza en el currentCart...
           const setCartAction = get().setCart
           setCartAction(currentCart.cartId)
        }catch(error){
            console.log(error)
            return set({error:error})
        }
        
    },
    updateProductQuantityInCart: async ({productId,newQuantity}) =>{
        const currentCart = get().currentCart; // Usando get() para acceder a currentCart
        if (!currentCart){
            //Agregamos al localStorage el producto
            //ponemos el products de localStorage en currentCart.Products xq en teolria siempre habra carro, ahora no hay xq no confifure lo del storage
            console.log('Entro x no cartId entonces opero obre carro de local storage')
            //Aca se ejecuta la funcion que agrega a localstorage
            return
        }
        //Si hay cart id modificamos ese cart en la bD, lo traemos y actualizamos.
        try{
            await DataService.updateProductQuantityInCart({
                cartId:currentCart.cartId,
                productId:productId,
                newQuantity:newQuantity
            })
           //Ahora como la BD fue actualizada hacemos setCart con el cartId del mismo carro. Tengamos en cuenta que setCart Busca el carro en la base de datos y lo actualiza en el currentCart...
           const setCartAction = get().setCart
           setCartAction(currentCart.cartId)      
        }catch(error){
            console.log(error)
            return set({error:error})
        }
    },

    //Crea la compra a partir del currentCart, de no hacerse lanza error. Luego actualiza el currentCart ya que el backend vacia el carro en la bd luego de crear la orden satisfactoriamente.
    //Tambien updatea el stock entonces tnego que actualizar la lista de productos en el front o al menos los productos comprados.
   

}))



export default useCartsStore;