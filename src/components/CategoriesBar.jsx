import React from 'react';
import './styles/CategoriesBar.css'
import useProductsStore from '../stores/useStoreProducts';
import { useNavigate,useLocation } from 'react-router-dom';

const CategoriesBar = () => {

    const {data,  setCategory} = useProductsStore()

    const navigate  = useNavigate()
    const location  = useLocation()

    console.log('Location: ', location)
    let categoriesList = data.map(item => (item.category))
    categoriesList = [...new Set(categoriesList)]

    
    const onHandleClick = (category) => {
     
        if (location.pathname != '/') navigate('/')
        setCategory(category)
    }


    return (
        <nav className="navbar">

        <div>
            <ul className="navbar-list">
                <li className="navbar-item">
                    <button  onClick={() => onHandleClick()}>Todas</button>
                </li>
                {
            
                    categoriesList?.map( item => (
                        <li className="navbar-item">
                            <button
                                key={item}
                                onClick={() => onHandleClick(item)}
                            >{item}</button>
                        </li>
                    ))
                }
            </ul>
        </div>
        <div>
            
        </div>
      </nav>
    );
}

export default CategoriesBar;


