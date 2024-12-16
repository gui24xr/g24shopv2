import './App.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import { useEffect } from 'react'
import { NavBar, ProductsContainer, CartContainer, OrderPanel, CreatingShippingPoints, AddressInMaps } from './components/components.index'
import { useAuth0 } from '@auth0/auth0-react'
import useProfileStore from './stores/useStoreProfile'
import Layout from './layouts/layout'

import Autocomplete from './components/Autocomplete'
//import { APIToken } from './database/mongocloud'
//import { testConect } from './database/request'


function App() {

  const {setProfile} = useProfileStore()
  const {user} = useAuth0()
  const currentUser = user //Lo pongo asi xq despues aca meto variable de entorno para cuando sea firebase solo tocar esto 
  
  useEffect(()=>{

    console.log('Cambio User: ', currentUser)
    setProfile(user)
  },[currentUser])



return (
  <>
  <BrowserRouter>
 
    <Routes>
      <Route  path="/" element={<Layout />}>
          <Route index element={<ProductsContainer />} />
          <Route path="/cart" element={<CartContainer/>} />
          <Route path="/order" element={<OrderPanel/>} />
          <Route path="/shippingpoints" element={<CreatingShippingPoints/>} />
          <Route path="/autocomplete" element={<Autocomplete/>} />
          <Route path="/address" element={<AddressInMaps/>} />
   
      </Route>
    </Routes>
</BrowserRouter>
  </>
  )
}

export default App

/*

return (
    <>
      <div>

          <NavBar />
          <CartContainer/>
          
      </div>
    </>
  )
}*/