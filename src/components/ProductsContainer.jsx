import React, { useCallback } from 'react';
import useProductsStore from '../stores/useStoreProducts';
import ProductCard from './ProductCard';
import './styles/ProductContainer.css'

const ProductsContainer = () => {

    const {data,loading,filteredData} = useProductsStore()

    console.log('FilteredData: ',filteredData)
    return (
        <div className="product-container-wrap">
            {loading && <p>Cargando...</p>}
            {filteredData?.map(item => (
                <ProductCard 
                    {...item}
                    
                    />))}
        </div>
    );
}

export default ProductsContainer;
