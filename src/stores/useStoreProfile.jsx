import { create } from "zustand";
import useCartsStore from "./useStoreCarts";
import { DataService } from "../services/dataservice";


const useProfileStore = create ((set)=>({
    //state
    currentUser: null,
    loading: true,
    error: null,
    //actions
    setProfile: async (user) => {
        //Va a extraer el user email y er si existe en la base de datos
        //Existe en BD => trae su informacion, cart y setea todo.
        //no existe en BD lo crea, le crea un carro y trae toda esa info.

        //Si no hay user todo se setea a null
        if (!user) {
          set({currentUser:null})
          useCartsStore.getState().setCart(null)
          return //para salir
        }
        
        
       try{
          //Mira si el user existe en la base de datos.
        const {email:userEmail} = user
        let userCartId
        let loggedUser
        //Pido el user al server, si no existo lo creo, luego seteo el carro
        set({loading:true})
        const searchedUser = await DataService.getUserByEmail({userEmail:userEmail})
        //Si !searchedUser es que no existe entonces lo creo y lo pongo como loggedUser
        if (!searchedUser){
          console.log('creo el user y tomo su cartId')
          const createdUser = await DataService.registerUser({
            email: userEmail,
            userName: user.nickname,
            firstName: user.given_name,
            lastName:user.family_name,
            profilePicture: user.picture,
          })
          console.log('gsgd: ', createdUser)
          //Si se creo el user bien lo meto en logged user
          loggedUser = createdUser
          userCartId = createdUser.cartId
        }
        else{
          loggedUser = searchedUser
          userCartId = searchedUser.cartId
        }

        console.log('logged usersss: ', loggedUser)

        //Seteo el currentUser con loggedUser
        set({currentUser:{
          userId:loggedUser.userId,
          email: loggedUser.email,
          userName: loggedUser.userName,
          firstName: loggedUser.firstName,
          lastName:loggedUser.lastName,
          profilePicture: loggedUser.profilePicture
        }})
        //Seteo en el estado del cart el carro con el cartId
        useCartsStore.getState().setCart(userCartId)

        return set({loading:false})
       
       }catch(error){
        console.log(error)
       }
    }
}))

//Esto es para crear carros en localStorage si no existe.


export default useProfileStore;




/*
 setProfile: async (user) => {
        //Va a extraer el user email y er si existe en la base de datos
        //Existe en BD => trae su informacion, cart y setea todo.
        //no existe en BD lo crea, le crea un carro y trae toda esa info.

        //Si no hay user todo se setea a null

        if (!user) {
          set({currentUser:null})
          useCartsStore.getState().setCart(null)
          return //para salir
        }
        
       //Mira si el user existe en la base de datos.
       const {email:userEmail} = user
       try{
        console.log('Inicio sesion: ', userEmail)
        const response = await axios.get('http://localhost:3000/users')
        const usersList = [...response.data]
        console.log('data de users: ', response.data)
        const userIndex = usersList.findIndex(item => item.email == userEmail)
        console.log('user index: ',userIndex)
        if (userIndex<0){
            //O sea si el user no existe lo creo y recien luego lo seteo a currenTuser.
            
            //Creo un carro.
            const createdCart = await axios.post('http://localhost:3000/carts',{
                products:[],
                amount:0,
            })

            //console.log('carro nuevo: ',createdCart.data)

            const createdUser = await axios.post('http://localhost:3000/users',{
                email: userEmail,
                userName: user.nickname,
                firstName: user.given_name,
                lastName:user.family_name,
                profilePicture: user.picture,
                cartId: createdCart.data.id
              })

              console.log('usuario nuevo: ',createdUser.data)
              //AHora que el user se creo correctamente, el mismo user lo seteo en currentUsr
             set({currentUser:{
                userId: createdUser.data.id,
                email: createdUser.data.email,
                userName: createdUser.userName,
                firstName: createdUser.firstName,
                lastName:createdUser.lastName,
                profilePicture: createdUser.profilePicture

              }, 

            /*  currentCart:{
                cartId: createdCart.data.id,
                products: createdCart.data.products,
                amount: createdCart.data.amount
              }
              })

              //Cambio el estado del carro en el store de carrtos
              useCartsStore.getState().setCart(createdCart.data.id)
  
              return
  
              
          }
          else{
              //seteo currentUser y el current cart... el cart lo debo pedir a la api
              const loggedUser = usersList[userIndex]
             // const userCart = await axios.get(`http://localhost:3000/carts/${loggedUser.cartId}`)
  
            
             set({currentUser:{
                  email: loggedUser.email,
                  userName: loggedUser.userName,
                  firstName: loggedUser.firstName,
                  lastName:loggedUser.lastName,
                  profilePicture: loggedUser.profilePicture
  
                },
               /* currentCart:{
                  cartId: userCart.data.id,
                  products: userCart.data.products,
                  amount: userCart.data.amount
                }
              })
  
              useCartsStore.getState().setCart(loggedUser.cartId)
              return
  
          }
  
         }catch(error){
          console.log(error)
         }
      }
  }))
*/