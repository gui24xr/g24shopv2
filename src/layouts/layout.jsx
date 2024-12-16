import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/Navbar';

const Layout = () => {
    return (
        <div>
        <header>
            <NavBar/>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    );
    
}

export default Layout;
