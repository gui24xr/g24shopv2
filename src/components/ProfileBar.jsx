import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import useProfileStore from '../stores/useStoreProfile';
import './styles/ProfileBar.css'

const ProfileBar = () => {

    const { currentUser } = useProfileStore()
    const { loginWithRedirect, logout } = useAuth0()

    console.log('En session Bar: ', currentUser)

    return (
        <div className='profilebar'>
            
            {
                currentUser ? (
                    <>
                    
                          
                            <span>{currentUser.userName}</span>
                           
                        

                        <button onClick={logout}>Logout</button>

                    </>
                )
                    :
                    (
                        <>

                            <button onClick={loginWithRedirect}>Login</button>

                        </>
                    )
            }


        </div>
    );
}

export default ProfileBar;