import { useEffect, useRef, useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithRedirect, getRedirectResult, GithubAuthProvider } from "firebase/auth";
import { FaRegUser } from "react-icons/fa";
import { RiLock2Line } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { parse } from 'date-fns';

function AuthPage({onLogged, userDat}) {
    const mainRef = useRef(undefined);
    const loginPasswordRef = useRef(undefined);
    const loginEmailRef = useRef(undefined);
    const signPasswordRef = useRef(undefined);
    const signEmailRef = useRef(undefined);
    const [signUpEmail, setSignUpEmail] = useState(undefined);
    const [signUpPassword, setSignUpPassword] = useState(undefined);
    const [signInEmail, setSignInEmail] = useState(undefined);
    const [signInPassword, setSignInPassword] = useState(undefined);
    const [showBtnActive, setShowBtnActive] = useState('disable');
    const [lockIconActive, setLockIconActive] = useState('lock-icon-active');
    const [userIconActive, setUserIconActive] = useState('user-icon-active');
    const userErrorRef = useRef(undefined);
    const loadingBarRef = useRef(undefined);
    const errorUserBg = useRef(undefined);
    const [errorMessage, setErrorMessage] = useState('Usuario ou Senha Incorretos !');
    let children = undefined;
    const [isLogged, setIsLogged] = useState(false);
    let formType = 'sign-in';
    const navigate = useNavigate(undefined);
    const provider = new GoogleAuthProvider();
    const providerGitHub = new GithubAuthProvider();

    const firebaseConfig = {
        apiKey: "AIzaSyBtuIzYiWYVg7j55olwUasnBSxS0ZOYEyo",
        authDomain: "login-project033.firebaseapp.com",
        projectId: "login-project033",
        storageBucket: "login-project033.appspot.com",
        messagingSenderId: "184638576364",
        appId: "1:184638576364:web:f4773520ee157785f4b7c9",
        measurementId: "G-GLZLSQQMEK"
    };
      
    const app = initializeApp(firebaseConfig);

    const auth = getAuth();

    const getRef = () => {
        if (mainRef.current){
            children = mainRef.current.childNodes;
        }else{
            setTimeout(getRef, 100);
        }
    };

    getRef();

    const fetchData = async (e) => {
        if(e){
            var email = e.email;
            var created = e.metadata.creationTime;
        }
        try{
            const response = await fetch('http://localhost:50100/user',
                {method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, created}),
            });

            if (response.ok){
                const data = await response.json();
                if (data){
                    console.log(data);
                }
            }else{
                setTimeout(() => {
                    fetchData();
                }, 2000);
            }
            
        }

        catch (error){
            console.error(error);
        }
    };

    const handleInput = (e) => {
        if (e.target.value){
            setShowBtnActive('active');
            if (e.target.className === 'password'){
                setLockIconActive('lock-icon-disabled')
                if (e.target.id === 'sign-up-password'){
                    setSignUpPassword(e.target.value);
                }
                else{
                    setSignInPassword(e.target.value);
                }
            }
        }else{
            setShowBtnActive('disable');
            setLockIconActive('lock-icon-active');
            loginPasswordRef.current.type = 'password';
            signPasswordRef.current.type = 'password';
        }
    };

    const handleEmailInput = (e) => {
        if (e.target.id === 'sign-in-email'){
            setSignInEmail(e.target.value);
            if (e.target.value){
                setUserIconActive('user-icon-disabled')
            } else{
                setUserIconActive('user-icon-active')
            }
        }else{
            setSignUpEmail(e.target.value);
            if (e.target.value){
                setUserIconActive('user-icon-disabled')
            } else{
                setUserIconActive('user-icon-active')
            }
        }
    }

    const resetInputValues = () => {
        loginPasswordRef.current.type = 'password';
        signPasswordRef.current.type = 'password';
        loginPasswordRef.current.value = '';
        signPasswordRef.current.value = '';
        loginEmailRef.current.value = '';
        signEmailRef.current.value = '';
        setShowBtnActive('disable');
        setLockIconActive('lock-icon-active');
        setUserIconActive('user-icon-active')
    }

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
         resetInputValues();
    };

    const handleShowInput = () => {
        if (loginPasswordRef.current || signPasswordRef.current){
            if (signPasswordRef.current.type === 'password' || loginPasswordRef.current.type === 'password'){
                loginPasswordRef.current.type = 'text';
                signPasswordRef.current.type = 'text';
            }else{
                loginPasswordRef.current.type = 'password';
                signPasswordRef.current.type = 'password';
            }
        }
    };

    const handleErrorActive = () => {
        userErrorRef.current.style.opacity = '1';
        userErrorRef.current.style.transform = 'translateY(0%)';
        loadingBarRef.current.style.animation = 'none';
        errorUserBg.current.style.opacity = '1';
        errorUserBg.current.style.zIndex = '190';
        setTimeout(() => {
            loadingBarRef.current.style.animation = 'loading 2s linear';
            setTimeout(() => {
                userErrorRef.current.style.opacity = '0';
                userErrorRef.current.style.transform = 'translateY(-100%)';
                errorUserBg.current.style.opacity = '0';
                errorUserBg.current.style.zIndex = '-50';
                setTimeout(() => {
                    navigate('/auth-page');
                }, 300);
            }, 2000);
        }, 300);
    };

    const redirect = (value) => {
        if (value){
            onLogged(true);
            navigate('/home');
        }else{
            handleErrorActive();
            onLogged(false);
        }
    };

    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, signInEmail, signInPassword).then((userCredential) => {
            const user = userCredential.user;
            redirect(true);
        })
        .catch((error) => {
            console.error(error);
            setErrorMessage(error.message);
            const errorCode = error.code;
            const errorMessage = error.message;
            redirect(false);
        });
    };

    const handleSignInGoogle = () => {
        signInWithRedirect(auth, provider);
    }

    const handleSignInGitHub = () => {
        signInWithRedirect(auth, providerGitHub);
    }

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword).then((userCredential) => {
            const user = userCredential.user;
            redirect(true);
        })
        .catch((error) => {
            setErrorMessage(error.message);
            redirect(false);
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    };

    const getUserDat = (data) => {
        userDat(data);
    }

    const handleSignOut = () => {
        signOut(auth).then(() => {
        }).catch((error) => {
        });
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLogged(true);
                const uid = user.uid;
                getUserDat(user);
                fetchData(user);
            } else {
                setIsLogged(false);
            }
        });

        const handleAuthResult =  () => {
            getRedirectResult(auth).then((result) => {
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential.accessToken;
                    const user = result.user;
                    redirect(true);
                }).catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    const email = error.customData.email;
                    const credential = GoogleAuthProvider.credentialFromError(error);
                    redirect(false);
                }
            );
        };

        const handleAuthResultGit =  () => {
            getRedirectResult(auth).then((result) => {
              const credential = GithubAuthProvider.credentialFromResult(result);
              if (credential) {
                const token = credential.accessToken;
              }
              const user = result.user;
              redirect(true);
            }).catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              const email = error.customData.email;
              const credential = GithubAuthProvider.credentialFromError(error);
              redirect(false);
            });
          
        }

        handleAuthResultGit();
        handleAuthResult();
        handleSignOut();
    },[]);

    const handleSubmitForm = (e) => {
        e.preventDefault();
        if (e.target.id === 'sign-up'){
            handleSignUp();
        }else{
            handleSignIn();
        }
        setSignInEmail('');
        setSignInPassword('');
        setSignUpEmail('');
        setSignUpPassword('');
    }

    return(
        <main ref={mainRef} className="auth-page">
            <section className="sign-up-form auth-form">
                <div className="container-form">
                    <form id="sign-up" onSubmit={handleSubmitForm}>
                        <h2>Cadastro</h2>
                        <div className="email-input-box">
                            <label htmlFor="sign-up-email">Email</label>
                            <div className="input-box">
                                <FaRegUser className={`user-icon ${userIconActive}`}/>
                                <input
                                    className="email"
                                    id="sign-up-email"
                                    type="text"
                                    placeholder="Digite seu email"
                                    ref={signEmailRef}
                                    onChange={handleEmailInput}
                                    required/>
                            </div>
                        </div>
                        <div className="password-input-box">
                            <label htmlFor="sign-up-password">Senha</label>
                            <div className="input-box">
                                <RiLock2Line className={`lock-icon ${lockIconActive}`}/>
                                <FaRegEyeSlash onClick={handleShowInput} className={`show-icon ${showBtnActive}`}/>
                                <input  className="password" type="password" id="sign-up-password" placeholder="Crie uma senha" onChange={handleInput} ref={signPasswordRef} required />
                            </div>
                        </div>
                        <div className="check-box">
                            <input id="btn-check1" type="checkbox" required/>
                            <label htmlFor="btn-check1">Eu concordo com os <span>Termos & Serviços</span></label>
                        </div>
                        <button className="btn-submit">Enviar</button>
                    </form>

                    <div className="form-division">
                        <div id="line"></div>
                        <h3>Ou</h3>
                    </div>
                    <div className="Other-authentications-form">
                        <button onClick={handleSignInGoogle}>
                            <FcGoogle className='google-icon'/>
                        </button>
                        <button onClick={handleSignInGitHub}>
                            <FaGithub className="facebook-icon"/>
                        </button>
                    </div>
                    <div className="account-exist">
                        <p>Ja tem uma conta ? <span onClick={handleChangeForm}>Entrar</span></p>
                    </div>
                </div>
            </section>

            <section className="sign-in-form auth-form">
                <div className="container-form">
                    <form id="sign-in" onSubmit={handleSubmitForm}>
                        <h2>Entrar</h2>
                        <div className="email-input-box">
                            <label htmlFor="sign-in-email">Email</label>
                            <div className="input-box">
                                <FaRegUser className={`user-icon ${userIconActive}`}/>
                                <input
                                    className="email"
                                    id="sign-in-email"
                                    type="text"
                                    ref={loginEmailRef}
                                    placeholder="Digite seu email"
                                    onChange={handleEmailInput}
                                    required/>
                            </div>
                        </div>
                        <div className="password-input-box">
                            <label htmlFor="sign-in-password">Senha</label>
                            <div className="input-box">
                                <RiLock2Line className={`lock-icon ${lockIconActive}`}/>
                                <FaRegEyeSlash onClick={handleShowInput} className={`show-icon ${showBtnActive}`}/>
                                <input className="password" type="password" id="sign-in-password" placeholder="Digite sua senha" onChange={handleInput} ref={loginPasswordRef} required/>
                            </div>
                        </div>
                        <div className="check-box">
                            <input id="btn-check2" type="checkbox"/>
                            <label htmlFor="btn-check2">Manter me <span>conectado</span></label>
                        </div>
                        <button>Entrar</button>
                    </form>

                    <div className="form-division">
                        <div id="line"></div>
                        <h3>Ou</h3>
                    </div>
                    <div className="Other-authentications-form">
                        <button onClick={handleSignInGoogle}>
                            <FcGoogle  className='google-icon'/>
                        </button>
                        <button onClick={handleSignInGitHub}>
                            <FaGithub className="facebook-icon"/>
                        </button>
                    </div>
                    <div className="account-exist">
                        <p>Não tem uma conta ? <span onClick={handleChangeForm}>Criar</span></p>
                    </div>
                </div>
            </section>

            <section className="page-text-area">
                <div className="text-center">
                    <h1>Bem Vindo !</h1>
                    <p>Esta é a nossa área de login e cadastro. Se já possui uma conta, basta entrar, caso contrário, siga para a área de cadastro.</p>
                </div>
            </section>

            <div className='user-error' ref={userErrorRef}>
                <h2>{errorMessage}</h2>
                <div className="loading-bar" ref={loadingBarRef}></div>
            </div>
            <div className="user-error-bg" ref={errorUserBg}></div>
        
        </main>
    )
}

export default AuthPage;