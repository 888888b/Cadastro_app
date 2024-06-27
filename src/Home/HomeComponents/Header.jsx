import '../Home.css';
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from 'react';
import { FirebaseContext } from '../../context/firebaseContext';

function Header() {
    const navigate = useNavigate(undefined);
    const firebaseApp = useContext(FirebaseContext);
    const handleNavigate = (e) =>{
        navigate(`/${e.target.id}`);
    } 

    useEffect(() => {
        console.log(firebaseApp);
    },[]);

    return(
        <header>
            <h1>{firebaseApp.currentUserData.name ? firebaseApp.currentUserData.name : null}</h1>
            <nav>
                <ul>
                    <li id='home' onClick={handleNavigate}>Inicio</li>
                    <li id="auth-page" onClick={handleNavigate}>Login</li>
                    <li>|</li>
                    <li id='profile' onClick={handleNavigate}>Conta</li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;