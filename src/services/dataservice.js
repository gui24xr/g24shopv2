//Este modulo es para trabajo con jsonserver por lo cual la logica se hace lado cliente.
import axios from 'axios'
import log from '../utils/logger'

export class DataService {
    //Trae todos los productos. Devuelve
    static async fetchDataProducts(){
        try{
            const response = await axios.get('http://localhost:3000/products')

            //Mas adelante deberia tranformar cada objeto del response en un productDTO para estandarizar
            const productsDTOArray = response.data.map(item => (this.getProductDTO(item)))
            return productsDTOArray
        }catch(error){
            throw error
        }
    }

    //Devuelve el producto y si no esta devuelve null
    static async getProductById({productId}){
        try{
            const searchedProduct = await axios.get(`http://localhost:3000/products/${productId}`)
            
            //habria que convertir en dto
            return this.getProductDTO(searchedProduct.data)
        }catch(error){
            if(error.status == 404) return null
            else throw error
        }
    }


    //Devuelve el usuario por email. si no existe, devuelve null
    static async getUserByEmail({userEmail}){
        try{
            const response = await axios.get(`http://localhost:3000/users?email=${userEmail}`)

            if (response.data.length < 1) return null
    
            //Convertiriamos a dto todos los registros
            console.log('Get user b mail: ', response.data)
            const searchedUser = this.getUserDTO(response.data[0])
            return searchedUser
        }catch(error){
            throw error
        }
    }

    
    static async getUserById({userEmail}){
        try{

        }catch(error){
            if(error.status == 404) return null
            else throw error
        }
    }




    static async registerUser({email,userName,firstName,lastName,profilePicture,cartId}){
        //Registra el user y devuelve el registro, si hubo error lanza excepcion.
        try{
            const cartForUser = await this.createCart()
            console.log('Cart for userrr: ', cartForUser)
            //Creamos un carro para el user: 
            const createdUser = await axios.post('http://localhost:3000/users',{
                email: email,
                userName: userName,
                firstName: firstName,
                lastName:lastName,
                profilePicture: profilePicture,
                cartId: cartForUser.cartId,
                shippingPointsList:[], //lista de ids de puntos como tiene ML
                defaultShippingPoint: null
              })

              return this.getUserDTO(createdUser.data)
        }catch(error){
            throw error
        }
    }

    //Devuelve un carrito por Id, y si no existe devuelve null
    static async getCartById({cartId}){
        try{
            const response = await axios.get(`http://localhost:3000/carts/${cartId}`)
            //Deberia transforrmar en dto
            return this.getCartDTO(response.data)
        }catch(error){
            //throw error
            if(error.status == 404) return null
            else throw error
        }
    }

    //Crea y devuelve un carro vacio
    static async createCart(){
        try{
            const createdCart = await axios.post('http://localhost:3000/carts',{
                products:[],
                amount:0,
                productsQuantity:0
            })
            console.log('Al crear carro: ', createdCart)
            return this.getCartDTO(createdCart.data)
        }catch(error){
            throw error
        }
    }

/*
    const cartModel = {
        cartId: '56565',
        amount: '345353',
        products:[
            {
                productId: '53',
                title: '453464hbfhjh',
                brand: 'dgdgd',
                price: '434364',
                quantity: 24,
            }
            
        ]
    }

    pero como lo quiero devolver con subtotal price en dto esa propiedad la agrego al hacer dto entonces lo debo agregar como en el model pero devolverlo en el dto con el calculo
        */
    //Agrega producto segun reglas de negocio y loa grega siempre y cuando haya stock...de no haber stock arroja excepcioon

   


    static async addProductToCart({cartId,productId,quantity}){
        try{
             log.debug('PPP: ', productId, cartId, quantity)
            //Busco el producto
            const searchedProduct = await this.getProductById({productId:productId})

            if (!searchedProduct) throw new Error('No se encontro el producto para agregar al carro.')
            if (searchedProduct.stock < quantity) throw new Error('No hay stock suficiente para agregar al carro...')

            //Busco el carro para aplicar la logica.
            const searchedCart = await this.getCartById({cartId:cartId})

            if (!searchedCart) throw new Error('No se encontro el carro para agregar al carro.')

            //Veo si el producto existe en el carro
            const productInCartIndex = searchedCart.products.findIndex(item => item.productId == productId)

            let subTotalAmount
            
            if (productInCartIndex<0){
                console.log('Agrego producto desde cero y actualizo el amount del carro y guardo')

                subTotalAmount = searchedProduct.price * quantity

                searchedCart.products.push({
                        productId: searchedProduct.productId,
                        title: searchedProduct.title,
                        brand: searchedProduct.brand,
                        price: searchedProduct.price,
                        quantity: quantity,
                        subTotalAmount: subTotalAmount,
                })

              
            }
            else{
                console.log('actualizo la cantidad')

                subTotalAmount = searchedProduct.price * quantity

                const updatedProductInfo = {
                    ...searchedCart.products[productInCartIndex],
                    quantity: Number(searchedCart.products[productInCartIndex].quantity) + Number(quantity),
                    subTotalAmount: searchedCart.products[productInCartIndex].subTotalAmount + subTotalAmount,
                }
                searchedCart.products[productInCartIndex] = updatedProductInfo

              

            }

            const updatedCartAmount =  searchedCart.amount + (searchedProduct.price * quantity)

            //Cantidad de productos en el carro.
            const updatedProductsQuantity = Number(searchedCart.productsQuantity) + Number(quantity)

            //Finalmente modifico
            await axios.patch(`http://localhost:3000/carts/${cartId}`, {products:searchedCart.products,amount:updatedCartAmount, productsQuantity:updatedProductsQuantity})

            
        }catch(error){
            console.log(error)
            throw error
        }
    }

    //Vacia el carrito, no devuelve nada, solo lanza excepcion si salio mal
    static async clearCart({cartId}){
        try{
            await axios.patch(`http://localhost:3000/carts/${cartId}`, {
                products:[],
                amount:0, 
                productsQuantity:0
            })
        }catch(error){
            console.log(error)
            throw(error)
        }
    }


    static async deleteProductFromCart({cartId,productId}){
        try{
            //Buscamos el carro
            const searchedCart = await this.getCartById({cartId:cartId})
            if (!searchedCart) throw new Error('No se encontro el carro para eliminar el producto...')
            //Busco el producto en el carro.
            const productIndexInCart = searchedCart.products.findIndex(item => item.productId == productId)

            if (productIndexInCart<0)  throw new Error('No se encontro el producto dentro del carro para eliminarlo...')
           
            //log.debug('LLego a deletePrpducts: ',cartId,' ',productId,' ', productIndexInCart)
            //Recalculamos los valores y luego quitamos el producto.
            //log.degub('Product index in cart: ', productIndexInCart)

            const updatedAmount = Number(searchedCart.amount) - Number(searchedCart.products[productIndexInCart].subTotalAmount)
            const updatedProductsQuantity = Number(searchedCart.productsQuantity) - Number(searchedCart.products[productIndexInCart].quantity)
            searchedCart.products.splice(productIndexInCart,1)

            log.debug('Valores nuevos para update al eliminar: ',searchedCart.products, '',updatedProductsQuantity,'  ',updatedAmount)
            //Ahora hacemos el cambio en la base de datos.
            await axios.patch(`http://localhost:3000/carts/${cartId}`, {
                products:searchedCart.products,
                amount:updatedAmount, 
                productsQuantity:updatedProductsQuantity
            })
            
            
           
        }catch(error){
            log.debug('error')
            throw error
        }
    }

   

    static async updateProductQuantityInCart({cartId,productId,newQuantity}){
        //Update de cantidad del producto en el carro.
        try{

            log.info('Info llegada a updateProduct', cartId,'',productId,'',newQuantity)
            //const obtengo el carro.
            const searchedCart = await this.getCartById({cartId:cartId})
            if (!searchedCart) throw new Error('No se encontro el carro para eliminar el producto...')
            //Busco el producto en el carro.
            const productIndexInCart = searchedCart.products.findIndex(item => item.productId == productId)

            if (productIndexInCart<0)  throw new Error('No se encontro el producto dentro del carro para eliminarlo...')

            //YA SE QUE TENGO EL CARRO... COMPARO LA CANTIDAD A AGRGAR O QUITAR
            const differentOfQuantity = newQuantity-searchedCart.products[productIndexInCart].quantity
            //Chequeo que hay producto suficiente en stock  en caso de que se pida agregar.
            if(differentOfQuantity > 0){
                const searchedProduct = await this.getProductById({productId:productId})

                if (!searchedProduct) throw new Error('No se encontro el producto para agregar al carro.')
                if (searchedProduct.stock < newQuantity) throw new Error('No hay stock suficiente para agregar al carro...')
            }


            //Ahora hago todos los calculos necesarios.
            const amountVariation = differentOfQuantity * searchedCart.products[productIndexInCart].price
            const newProductsQuantityInCart = searchedCart.productsQuantity + differentOfQuantity
            
            const updatedSubTotalAmount = searchedCart.products[productIndexInCart].subTotalAmount + amountVariation
            const updatedAmountCart = searchedCart.amount + amountVariation

            //Formo el nuevo array productos pero modifico la cantidad en el productId requerido
            const newProductsArray = [...searchedCart.products]
            newProductsArray[productIndexInCart] = {
                ...searchedCart.products[productIndexInCart],
                quantity: newQuantity,
                subTotalAmount: updatedSubTotalAmount
            }

            log.info(
                'Nueva cantidad de unidades de producto: ', newQuantity,
                'Diferencia de cantidad', differentOfQuantity,
                'Variacion en monto: ', amountVariation,
                'Nueva cantidad de productos en el carro: ', newProductsQuantityInCart,
                'Monto de carro modificado: ',updatedAmountCart,
                'New productsArray: ', newProductsArray
            )

            //hago la solicitud a la base de datos.
           return  await axios.patch(`http://localhost:3000/carts/${cartId}`, {
                products:newProductsArray,
                amount:updatedAmountCart,
                productsQuantity:newProductsQuantityInCart
            })

        }catch(error){
            console.log(error)
            throw(error)
        }
    }


    static async saveProducts(listOfProducts){
        try{
            //recorre la lista, los quita del stock de productos y los guarda en una lista de salvados para mas tarde cuando la compra es confirmada borrarlos tambien de la lista de reserva... si eventualmente se cancela la compra los productos vuelven al stock por la funcion returnStock
            log.debug('Me vino la lista para reservar: ', listOfProducts)
            return
        }catch(error){
            console.log(error)
            throw error
        }
    }

    static async returnStock(listOfProducts){
        try{
            return
        }catch(error){
            console.log(error)
            throw error
        }
    }

    static async createOrder({userEmail}){
        //Crea la order a partir del userRmail, mira su carro, genera la compra y vacia el carro.
        //Updatea stock poniendo el producto en reserva. Porque si la compra es cancelada deve volver al stock ese procuto.
        //Si todo sale ok devuelve un OrderDTO con los datos de la compra.
        //La compras tendran estados: created,pendiente(se completo datos de envio y pago),pagada, en camino(o sea en reparto), finalizada(finalizada es ya entregada o retiraday ahi finalmente se borra del stock reservado)
        try{
            //Ya que necesito el user para tomar datos y el cart, los pido.
            const searchedUser = await this.getUserByEmail({userEmail:userEmail})
            if (!searchedUser) throw new Error('No existe el usuario para realizar la compra...')
            const searchedCart = await this.getCartById({cartId:searchedUser.cartId})
            if(!searchedCart || searchedCart.productsQuantity<1) throw new Error('El carro no existe o esta vacio, no se puede hacer la compra...')
            //Tambien seria necesario comprobar nuevamente el stock por seguridad

            //Tenemos todo y podemos crear la compra.
            //Seugun el id del metodo de pago genero link o no
       
          //La orden vacia se crea asi, luego hay que completar pago y envios.

          //Info del user le vamos a quitar algo de info a ese dto

            const newOrder = {
                buyer:{...searchedUser},
                detail:[...searchedCart.products],
                amount: searchedCart.amount,
                payment: null,
                shipping:null,
                state:'created'
            }

            const createdOrder = await axios.post(`http://localhost:3000/orders`,newOrder)

            //Pasar el stock a reserva
            await this.saveProducts(createdOrder.data.detail)
            await this.clearCart({cartId:searchedCart.cartId})
            //Luego hacer el dto
            log.debug('userEmail: ', userEmail, 
                'searchedUser: ',searchedUser,
                'searchedCart:' ,searchedCart,
                'newOrder:' ,newOrder
               )
               
            return this.getOrderDTO(createdOrder.data)


            //Pero el productos va a pasar a reserva
            
          

        }catch(error){
            console.log(error)
            throw error
        }

    }


       //Devuelve el producto y si no esta devuelve null
       static async getOrderById({orderId}){
        try{
            const searchedOrder = await axios.get(`http://localhost:3000/orders/${orderId}`)
            
          
            return this.getOrderDTO(searchedOrder.data)
        }catch(error){
            if(error.status == 404) return null
            else throw error
        }
    }


    static async getPaymenthsMethods(){
        //Devuelve un array de objetos con los metodos de pago habilitados/configurados en nuestro server
        try{
            const methods = await axios.get(`http://localhost:3000/paymentMethods`)
            console.log('metodos: ', methods)
            return methods.data
        }catch(error){
            console.log(error)
            throw error
        }
    }
    
    static async setOrderPayment({orderId,paymentId,paymentData}){
        /*el cliente sera el responsable de enviar en cada propiedad la informacion correcta segun el meotod de pago elegido*/
        /* Esta funcion prepara el objeto que contiene la informacion del payment*/ 
        try{
            //const searchedOrder = await
        }catch(error){
            console.log('error')
            throw error
        }
    }


    


    static getUserDTO(user){
        return {
            userId:user.id,
            email:user.email,
            userName:user.userName,
            firstName:user.firstName,
            lastName:user.lastName,
            profilePicture:user.profilePicture,
            cartId:user.cartId
        }

    }


    static getCartDTO(cart){
        return{
            cartId:cart.id,
            products:cart.products,
            amount: cart.amount,
            productsQuantity: cart.productsQuantity
      
        }
    }

    static getProductDTO(product){

        const imgUrl = 'https://media.gettyimages.com/id/1471193257/es/vector/maqueta-de-tel%C3%A9fono-de-dise%C3%B1o-minimalista-similar-a-la-plantilla-de-iphone.jpg?s=2048x2048&w=gi&k=20&c=-0nixUGbg-yXM_pdsgHHY-0Z5sDcnaNoY3ZNzckMy7c='

        return {
            productId: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
            discountPercentage: product.discountPercentage,
            rating:product.rating,
            stock: product.stock,
            brand: product.brand,
            category: product.category,
            thumbnail: [imgUrl,imgUrl,imgUrl,imgUrl], //Esto x tener productos truchos dps arreglad
            images:[imgUrl,imgUrl,imgUrl,imgUrl]

        }
    }

    static  getOrderDTO(order){

        //Al generar el dto, para que salga toda la info debo pedir  a la base de datos los datos de los sitemas de pago y eso.
   

        return{
            orderId: order.id,
            detail: order.detail,
            amount: order.amount,
            payment: order.payment || null/*{
                methodId: order.methodId,
                methodName: null, //Esta info hay que pedir a las configuraciones 
                data:order.data,
                
            },*/,
            shippingPoint: order.shippingPoint|| null,
            state:"created"

        }
        
    }


}