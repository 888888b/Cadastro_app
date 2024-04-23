import { FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

function Menu() {
    const navigate = useNavigate(undefined);
    const [menuActive, setMenuActive] = useState('disable');
    const backgroundMenuRef = useRef(undefined);

    const handleNavigate = (e) => {
        navigate(`/${e.target.id}`);
    }

    const handleMenuActive = () => {
        if (menuActive === 'menu-active'){
            setMenuActive('disable');
            backgroundMenuRef.current.style.height = '105%';
        }else{
            setMenuActive('menu-active');
            backgroundMenuRef.current.style.height = '0%';
        }  
    }

    return(
        <div className={`menu-container ${menuActive}`}>
            <div ref={backgroundMenuRef} className="background-hide-menu"></div>
            <div className="menu-icon-box">
                <FiMenu onClick={handleMenuActive} className="menu-icon"/>
            </div>
            <div className="options-box">
                <nav>
                    <ul>
                        <li id='home' onClick={handleNavigate}>Home</li>
                        <li id='usuarios' onClick={handleNavigate}>Usuarios</li>
                        <li id="auth-page" onClick={handleNavigate}>Login</li>
                        <li id='profile' onClick={handleNavigate}>Conta</li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Menu;