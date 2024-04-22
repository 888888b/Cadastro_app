import { useEffect, useRef, useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AuthPage({ onLogged }) {
    const mainRef = useRef(undefined);
    const signInInput = useRef(undefined);
    const signUpInput = useRef(undefined);
    const [showBtnActive, setShowBtnActive] = useState('disable');
    let children = undefined;
    let formType = 'sign-in';
    const navigate = useNavigate(undefined);

    const getRef = () => {
        if (mainRef.current){
            children = mainRef.current.childNodes;
        }else{
            setTimeout(getRef, 100);
        }
    }

    getRef()

    const handleChangeForm = () => {
        if (formType === 'sign-in'){
            children[0].style.opacity = 1;
            children[0].style.transform = 'translateX(100%)';
            children[1].style.transform = 'translateX(-100%)';
            children[1].style.opacity = 0;
            formType = 'sign-up';
         }else{
            children[0].style.opacity = 0;
            children[0].style.transform = 'translateX(0%)';
            children[1].style.transform = 'translateX(0%)';
            children[1].style.opacity = 1;  
            formType = 'sign-in';  
         }
         signInInput.current.type = 'password';
         signUpInput.current.type = 'password';
    }

    const handleInput = (e) => {
        if (e.target.value){
            setShowBtnActive('active');
        }else{
            setShowBtnActive('disable');
            signInInput.current.type = 'password';
            signUpInput.current.type = 'password';
        }
    }

    const handleShowInput = () => {
        if (signInInput.current || signUpInput.current){
            if (signUpInput.current.type === 'password' || signInInput.current.type === 'password'){
                signInInput.current.type = 'text';
                signUpInput.current.type = 'text';
            }else{
                signInInput.current.type = 'password';
                signUpInput.current.type = 'password';
            }
        }
    }

    setTimeout(() => {
        onLogged = true;
        console.log(onLogged);
    }, 2000);

    const handleSubmitForm = () => {
        navigate('/home');
    }

    return(
        <main ref={mainRef} className="auth-page">
            <section className="sign-up-form auth-form">
                <button className="change-form-btns" onClick={handleChangeForm}>Entrar</button>
                <form onSubmit={handleSubmitForm}>
                    <h2>Cadastro</h2>
                    <div className="email-input-box">
                        <label htmlFor="sign-up-email">Email</label>
                        <input id="sign-up-email" type="text" placeholder="Digite seu email" required/>
                    </div>
                    <div className="password-input-box">
                        <label htmlFor="sign-up-password">Senha</label>
                        <div className="input-box">
                            <FaRegEyeSlash onClick={handleShowInput} className={`show-icon ${showBtnActive}`}/>
                            <input type="password" id="sign-up-password" placeholder="Crie uma senha" onChange={handleInput} ref={signUpInput} required />
                        </div>
                    </div>
                    <div className="check-box">
                        <input id="btn-check1" type="checkbox" required/>
                        <label htmlFor="btn-check1">Eu concordo com os <span>Termos & Serviços</span></label>
                    </div>
                    <button type="submit">Enviar</button>
                </form>
            </section>

            <section className="sign-in-form auth-form">
                <button className="change-form-btns" onClick={handleChangeForm}>Cadastro</button>
                <form onSubmit={handleSubmitForm}>
                    <h2>Entrar</h2>
                    <div className="email-input-box">
                        <label htmlFor="sign-in-email">Email</label>
                        <input id="sign-in-email" type="text" placeholder="Digite seu email" required/>
                    </div>
                    <div className="password-input-box">
                        <label htmlFor="sign-in-password">Senha</label>
                        <div className="input-box">
                            <FaRegEyeSlash onClick={handleShowInput} className={`show-icon ${showBtnActive}`}/>
                            <input type="password" id="sign-in-password" placeholder="Digite sua senha" onChange={handleInput} ref={signInInput} required/>
                        </div>
                    </div>
                    <div className="check-box">
                        <input id="btn-check2" type="checkbox" required/>
                        <label htmlFor="btn-check2">Eu concordo com os <span>Termos & Serviços</span></label>
                    </div>
                    <button type="submit">Entrar</button>
                </form>
            </section>

            <section className="page-text-area">
                <div className="text-center">
                    <h1>Bem Vindo !</h1>
                    <h2>Esta é a nossa área de login e cadastro. Se já possui uma conta, basta entrar; caso contrário, siga para a área de cadastro.</h2>
                </div>
            </section>
        </main>
    )
}

export default AuthPage;