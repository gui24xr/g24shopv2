import {create} from 'zustand';
import { DataService } from '../services/dataservice.js';


const useProductsStore = create((set,get) => ({
  
  //state
  data: null,
  filteredData:null,
  loading: true,
  currentProduct: null,

    //actions
  setCurrentProduct:(productId) => set({currentProduct:productId}),

  setCategory: (selectedCategory) => {
    //Siempre seteamos filteredData a data para reiniciar
    set(state => ({filteredData:state.data}))
    if (selectedCategory){
        set(state => ({filteredData:state.data.filter(item => item.category == selectedCategory)}))
    }
 
  },

  findProducts: (query) => {
    const searched = query.toLowerCase()
    set(state => ({filteredData: state.data.filter(item => item.title.toLowerCase().includes(searched))}))
  },

  setFilteredData:({category,query,brand}) =>{
    //Si me pasan una categoria filtro de data las categorias
    //Si me pasan query filtro por query
    //Si me pasan brand filtro por marcas
    //si no me pasan nada filteredData = data
    //EL CASO DE BUSQUEDAS EN ESTE CASO SERA LADO CLIENTE.
    set(state => ({filteredData:state.data}))
  },
  getProductStock: ({productId}) => {
    //Me informa del stock actual de producto a partir de la ifnromacion lado cliente
    const productsData = get().data
    const productIndex = productsData.findIndex(item => item.productId == productId)

    if (productIndex< 0) throw new Error('No existe producto con este id en nuestro listado...')

    return productsData[productIndex].stock
  },   

  fetchDataProducts: async () => {
    //fetchDataProducts es un action que hacemops nosotros
    //Primero ponemos la propiedad loading a true, y como no neecesito su valor inicial lo puedo setear directo dentro de set
    set({ loading: true })

    try {
      //const response = await axios.get('http://localhost:3000/products');
      const response = await DataService.fetchDataProducts();
      set({ data: response, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error(error);
    }
    finally{
      set({ loading: false });
    }

    
  },
}))

//Con esta accion modificare en la base de datos el stock del producto.

//Inicio aca la base de datos


// Llamo a la accion fetch data para cargar en data los productos de la base de datos.
await useProductsStore.getState().fetchDataProducts();
// Una vez que tengo fetchDataProducts tambien ahora cargo todos los productos a filteredData.
useProductsStore.getState().filteredData = useProductsStore.getState().data
export default useProductsStore;