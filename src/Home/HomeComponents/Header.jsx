import '../Home.css';
import { useNavigate } from "react-router-dom";


function Header() {
    const navigate = useNavigate(undefined);
    const handleNavigate = (e) =>{
        navigate(`/${e.target.id}`);
    } 

    return(
        <header>
            <h1>Vitor</h1>
            <nav>
                <ul>
                    <li id='home' onClick={handleNavigate}>Home</li>
                    <li id="auth-page" onClick={handleNavigate}>Login</li>
                    <li>|</li>
                    <li id='profile' onClick={handleNavigate}>Conta</li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;