import React,{useEffect,useState} from 'react';
import { AutoComplete, Input } from 'antd';
import useProductsStore from '../stores/useStoreProducts';



const Autocomplete = () => {
        const [options, setOptions] = useState([]);
        const {data:productsData} = useProductsStore()
        const [selectedOption, setSelectedOption] = useState('')

        const searchInProducts = (value) => {
            //Esta funcion filtra la lista de productos en base al value y luego devuelve el array que necesita la propiedad options.
           const filteredData = [...productsData] //Para no modificar el state ya que es priube
           const searched = value?.toLowerCase()
           filteredData.filter(item => item.title.toLowerCase().includes(searched))
           /*ya tengo la data filtrada. Ahora genero un array de objetos
           {
            value: valor de la opcion.
            label: Expresion jsx que quiero renderizar para esta opcion
            }
           */
           const arrayPaDevolver = filteredData.map( (item) =>{
            return {
                value: item.productId,
                label:(<span>{item.title}</span>)
            }
           })

           return arrayPaDevolver
        }
        
        const handleSearch = (value) => {
            console.log('onSearch', value)
            //Cada vez que cambie onSearch voy a mandar a buscar resultados en data
            setOptions(value ? searchInProducts(value) : [])
        }
        
        const onSelect = (value) => {
            //Se ejcuta al tocar una sugerencia u options... 
          console.log('onSelect', value);
            //Renderizo la opcion seleccionada.
            setSelectedOption(value)
        };
       
        return (
        <>
             <AutoComplete
            popupMatchSelectWidth={252}
            style={{width: 300,}}
            size="large"
            options={options}
            onSelect={onSelect}
            onSearch={handleSearch}
            
          >
            <Input.Search size="large" placeholder="input here" enterButton />

          </AutoComplete>

          <p>Seleccionado ProductId: {selectedOption}</p>
        </>
         
        );
    
}

export default Autocomplete;
