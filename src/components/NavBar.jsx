import React from 'react';
import './styles/NavBar.css'
import {SearchForm, CategoriesBar, ProfileBar, CartWidget} from './components.index.js'
import './styles/NavBar.css'


const NavBar = () => {
    return (
        <div className='navbar'>
            <div className='navbar-sup'>
                <CartWidget/>
                <SearchForm/>
                <ProfileBar/>
            </div>
            <div>
                <CategoriesBar/>
            </div>
            
            
            
        </div>
    );
}

export default NavBar;
