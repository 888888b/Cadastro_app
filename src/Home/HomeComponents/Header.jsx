import { useRef } from "react";
import { useNavigate } from "react-router-dom";


function Header({userDat}) {
    const pagesRef = useRef(undefined);
    const navigate = useNavigate(undefined);
    let children = undefined;
    
    const handlePagesRef = () => {
        if (pagesRef.current){
            children = pagesRef.current.childNodes;
        }else{
            setTimeout(handlePagesRef, 100);
        }
    }

    handlePagesRef()

    const handleNavigate = (e) =>{
        navigate(`/${e.target.id}`);
        for (let element in children){
            if (e.target.id === children[element].id){
                children[element].style.borderBottom = '1.5pt solid white';
            }else{
                children[element].style.borderBottom = '1.5pt solid transparent';
            }
        }
    } 

    return(
        <header>
            {userDat.displayName ? (
                <h1>{userDat.displayName}</h1>
            ): (
                <h1>Nome</h1>
            )}
            <nav>
                <ul ref={pagesRef}>
                    <li id='home' onClick={handleNavigate}>Home</li>
                    <li id='usuarios' onClick={handleNavigate}>Usuarios</li>
                    <li id="auth-page" onClick={handleNavigate}>Login</li>
                    <li id='profile' onClick={handleNavigate}>Conta</li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;