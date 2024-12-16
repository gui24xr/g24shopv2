import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react'
import './index.css'


createRoot(document.getElementById('root')).render(

    <Auth0Provider
        domain="dev-s1xkcnryhvf7w5v0.us.auth0.com"
        clientId="wlLClvLq5e10XJROGqUCexDkPwyScZKb"
        cacheLocation="localstorage" // o "memory" para que no persista entre recargas
        authorizationParams={{
            redirect_uri: window.location.origin
        }}>
        <App />
    </Auth0Provider>

)
