import React from 'react';
import './styles/ProductCard.css'
import useCartsStore from '../stores/useStoreCarts';




const ProductCard = (props) => {

   
  const {productId,images,title,brand,category,description,price,discountPercentage,rating,stock} = props
  const {addProductToCart} = useCartsStore()
 
  const onHandleSubmit = (event) => {
  event.preventDefault()
  const formData = new FormData(event.target)

  const {quantity} = Object.fromEntries(formData.entries())
  addProductToCart({productId: productId, quantity: quantity})

}
    return (
      <div className="product-card">
      <img src={images[0]} alt={title} className="product-image" />
      <h2 className="product-title">{title}</h2>
      <p className="product-brand">Brand: {brand}</p>
      <p className="product-category">Category: {category}</p>
      <p className="product-description">{description}</p>
      <p className="product-price">${price}</p>
      <p className="product-discount">Discount: {discountPercentage}%</p>
      <p className="product-rating">Rating: {rating} ⭐</p>
      <p className="product-stock">Stock: {stock}</p>
      <form type="submit" onSubmit={onHandleSubmit}>
        <label for="quantity-input"/>Cantidad<label/>
        <input type="number" name="quantity" id="quantity-input" required/>
        <button type="submit" >Agregar</button>

      </form>
    </div>
    );
}

export default ProductCard;
