/*Styles*/
import './Auth.css';

/*React*/
import { useState, useRef, useContext, useEffect } from "react";

/*React Router Dom*/
import { useNavigate } from "react-router-dom";

/*React Icons*/
import { FaRegUser, FaGithub, FaRegEyeSlash } from "react-icons/fa";
import { RiLock2Line } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";

/*React Toastify*/
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/*Auth images*/
import visualAccent from '../assets/visualAccent.png'

/*Firebase modules*/
import { FirebaseContext } from '../context/firebaseContext';
import { getDatabase, ref, push, set, onValue, orderByChild, query, equalTo } from 'firebase/database';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function AuthPage() {

    /*Form variables*/
    const [isEmailIconActive, setIsEmailIconActive] = useState('email-visible');
    const [isEyeIconActive, setIsEyeIconActive] = useState('eye-invisible');
    const [isLockIconActive, setIsLockIconActive] = useState('lock-visible');
    const [isUserIconActive, setIsUserIconActive] = useState('user-visible');
    const [activeForm, setActiveForm] = useState('sign-in');
    const formsRef = useRef([]);
    const signUpInputsRef = useRef([]);
    const signInInputsRef = useRef([]);
    const pageContainerRef = useRef(undefined);

    /*React Router variable*/
    const navigate = useNavigate(undefined);

    /*Firebase variables*/
    const app = useContext(FirebaseContext);
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    const loginWithGoogle = () => {
        signInWithPopup(auth, provider).then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            if (user.email) {
                addGoogleDataToDb(user.email, user.displayName && user.displayName, user.photoURL && user.photoURL);
            }
        }).catch((error) => {
            console.error(error.message);
        });
    };

    const addGoogleDataToDb = async (userEmail, userName = 'User', photoURL = '') => {
        const db = getDatabase(app.firebaseApp);
        const userRef = ref(db, 'users');
        const userID = push(userRef).key;
        const creationDate = new Date().toLocaleString().replace(',', '');

        try {
            const response = await findAccountByemail(userEmail);
            if (response) {
                app.setIsLoggedIn(true);
                app.setCurrentUserData({
                    email: userEmail,
                });
                navigate('/home');
            } else {
                set(ref(db, `users/${userID}`), {
                    name: userName,
                    email: userEmail,
                    created: creationDate,
                    imageURL: photoURL
                }).then(() => {
                    app.setIsLoggedIn(true);
                    app.setCurrentUserData({
                        email: userEmail
                    });
                    navigate('/home');
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleChangeForm = () => {
        if (activeForm === 'sign-in') {
            formsRef.current[0].style.opacity = 1;
            formsRef.current[0].style.transform = 'translateX(100%)';
            formsRef.current[1].style.transform = 'translateX(-100%)';
            formsRef.current[1].style.opacity = 0;
            setActiveForm('sign-up');
        } else {
            if (activeForm === 'sign-up') {
                formsRef.current[0].style.opacity = 0;
                formsRef.current[0].style.transform = 'translateX(0%)';
                formsRef.current[1].style.transform = 'translateX(0%)';
                formsRef.current[1].style.opacity = 1;
                setActiveForm('sign-in');
            }
        }
        resetInputValues([...signInInputsRef.current, ...signUpInputsRef.current]);
    };

    const ShowPasswordInputValue = () => {
        if (activeForm === 'sign-in') {
            if (signInInputsRef.current) {
                if (signInInputsRef.current[1].type === 'text') {
                    signInInputsRef.current[1].type = 'password';
                } else {
                    signInInputsRef.current[1].type = 'text';
                }
            }
        } else {
            if (signUpInputsRef.current) {
                if (signUpInputsRef.current[2].type === 'text') {
                    signUpInputsRef.current[2].type = 'password';
                } else {
                    signUpInputsRef.current[2].type = 'text';
                }
            }
        }
    };

    const resetInputValues = (inputsRef) => {
        inputsRef.forEach(element => {
            element.value = null;
        });
        inputObserver(null, 'all');
    };

    const inputObserver = (e, type) => {
        if (e) {
            if (type === 'password') {
                setIsLockIconActive('lock-invisible')
                setIsEyeIconActive('eye-visible');
            } else {
                if (type === 'name') {
                    setIsUserIconActive('user-invisible');
                } else {
                    setIsEmailIconActive('email-invisible');
                }
            }
        } else {
            if (type === 'password') {
                setIsEyeIconActive('eye-invisible');
                setIsLockIconActive('lock-visible')
            } else {
                if (type === 'name') {
                    setIsUserIconActive('user-visible');
                }

                if (type === 'email') {
                    setIsEmailIconActive('email-visible');
                }

                if (type === 'all') {
                    setIsUserIconActive('user-visible');
                    setIsEyeIconActive('eye-invisible');
                    setIsLockIconActive('lock-visible')
                    setIsEmailIconActive('email-visible');
                }
            }
        }
    };

    const notify = (str = 'Campo de string vazio') => {
        toast.error(str, {
            position: 'top-center',
            autoClose: 1500,
        });

        if (pageContainerRef.current) {
            pageContainerRef.current.classList.add('element-opacity-02');
            setTimeout(() => {
                pageContainerRef.current.classList.remove('element-opacity-02');
            }, 2300);
        }
    };

    const handleFormSubmit = (e, data, callback) => {
        const userData = [];
        e.preventDefault();
        data.forEach(element => {
            userData.push(element.value.toLowerCase());
        });

        callback(...userData);
    };

    const addUserToDb = async (userName, userEmail, userPassword) => {

        if (!userEmail || !userName || !userPassword) {
            return null;
        }

        const db = getDatabase(app.firebaseApp);
        const userRef = ref(db, 'users');
        const userID = push(userRef).key;
        const creationDate = new Date().toLocaleString().replace(',', '');

        try {
            const response = await findAccountByemail(userEmail);
            if (response) {
                notify('Email já cadastrado!')
            } else {
                set(ref(db, `users/${userID}`), {
                    name: userName,
                    email: userEmail,
                    password: userPassword,
                    created: creationDate,
                    imageURL: ''
                }).then(() => {
                    app.setIsLoggedIn(true);
                    app.setCurrentUserData({
                        name: userName,
                        email: userEmail,
                        password: userPassword,
                        created: creationDate,
                        imageURL: ''
                    });
                    navigate('/home');
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const authenticateUser = async (userEmail, userPassword) => {
        if (!userEmail || !userPassword) {
            return null;
        }

        try {
            const response = await findAccountByemail(userEmail);
            if (response) {
                const user = Object.values(response)[0];
                if (user.email === userEmail && user.password === userPassword) {
                    app.setIsLoggedIn(true);
                    app.setCurrentUserData(user);
                    navigate('/home');
                } else {
                    notify('E-mail ou senha incorretos');
                };
            } else {
                notify('Usuário não encontrado');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const findAccountByemail = async (userEmail) => {
        let response = false;
        const db = getDatabase(app.firebaseApp);
        const userRef = ref(db, 'users');
        const queryDB = query(userRef, orderByChild('email'), equalTo(userEmail));
        await new Promise((resolve, reject) => {
            onValue(queryDB, (snapshot) => {
                if (snapshot.val()) {
                    response = snapshot.val();
                }
                resolve();
            }, (error) => {
                console.error(error);
                reject(error);
            });
        });

        return response;
    };

    return (
        <main ref={pageContainerRef} className="auth-page">
            <section ref={(e) => { formsRef.current[0] = e }} className="sign-up-form auth-form">
                <div className="container-form">
                    <form onSubmit={(e) => handleFormSubmit(e, signUpInputsRef.current, addUserToDb)} id="sign-up">
                        <h2>Cadastro</h2>

                        <div className="name-input-box">
                            <label htmlFor="user-name">Nome</label>
                            <div className="input-box">
                                <FaRegUser className={`user-icon ${isUserIconActive}`} />
                                <input
                                    type="text"
                                    id='user-name'
                                    onChange={(e) => inputObserver(e.target.value, 'name')}
                                    ref={(e) => signUpInputsRef.current[0] = e}
                                    placeholder="Nome de usuario"
                                    required
                                />
                            </div>
                        </div>

                        <div className="email-input-box">
                            <label htmlFor="sign-up-email">Email</label>
                            <div className="input-box">
                                <MdEmail className={`email-icon ${isEmailIconActive}`} />
                                <input
                                    className="email"
                                    id="sign-up-email"
                                    type="email"
                                    onChange={(e) => inputObserver(e.target.value, 'email')}
                                    ref={(e) => signUpInputsRef.current[1] = e}
                                    placeholder="Digite seu email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="password-input-box">
                            <label htmlFor="sign-up-password">Senha</label>
                            <div className="input-box">
                                <RiLock2Line className={`lock-icon ${isLockIconActive}`} />

                                <FaRegEyeSlash
                                    onClick={() => ShowPasswordInputValue()}
                                    className={`eye-icon ${isEyeIconActive}`}
                                />

                                <input
                                    className="password"
                                    type="password"
                                    id="sign-up-password"
                                    placeholder="Crie uma senha"
                                    onChange={(e) => inputObserver(e.target.value, 'password')}
                                    ref={(e) => signUpInputsRef.current[2] = e}
                                    required
                                />
                            </div>
                        </div>

                        <div className="check-box">
                            <input id="btn-check1" type="checkbox" required />
                            <label htmlFor="btn-check1">Eu concordo com os <span>Termos & Serviços</span></label>
                        </div>

                        <button className="btn-submit">Enviar</button>
                    </form>

                    <div className="account-exist">
                        <p>Ja tem uma conta ? <span onClick={handleChangeForm}>Entrar</span></p>
                    </div>
                </div>
            </section>

            <section ref={(e) => { formsRef.current[1] = e }} className="sign-in-form auth-form">
                <div className="container-form">
                    <form onSubmit={(e) => handleFormSubmit(e, signInInputsRef.current, authenticateUser)} id="sign-in">
                        <h2>Entrar</h2>

                        <div className="email-input-box">
                            <label htmlFor="sign-in-email">Email</label>
                            <div className="input-box">
                                <MdEmail className={`email-icon ${isEmailIconActive}`} />
                                <input
                                    className="email"
                                    id="sign-in-email"
                                    type="email"
                                    onChange={(e) => inputObserver(e.target.value, 'email')}
                                    ref={(e) => signInInputsRef.current[0] = e}
                                    placeholder="Digite seu email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="password-input-box">
                            <label htmlFor="sign-in-password">Senha</label>
                            <div className="input-box">
                                <RiLock2Line className={`lock-icon ${isLockIconActive}`} />

                                <FaRegEyeSlash
                                    onClick={() => ShowPasswordInputValue()}
                                    className={`eye-icon ${isEyeIconActive}`}
                                />

                                <input
                                    className="password"
                                    type="password"
                                    id="sign-in-password"
                                    placeholder="Digite sua senha"
                                    onChange={(e) => inputObserver(e.target.value, 'password')}
                                    ref={(e) => signInInputsRef.current[1] = e}
                                    required
                                />
                            </div>
                        </div>
                        <div className="check-box">
                            <input id="btn-check2" type="checkbox" />
                            <label htmlFor="btn-check2">Manter me <span>conectado</span></label>
                        </div>
                        <button>Entrar</button>
                    </form>

                    <div className="form-division">
                        <div id="line"></div>
                        <h3>ou</h3>
                    </div>
                    <div className="Other-authentications-form">
                        <button onClick={() => { loginWithGoogle() }}>
                            <FcGoogle className='google-icon' />
                        </button>
                        <button>
                            <FaGithub className="facebook-icon" />
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
                <img src={visualAccent} alt="ilustrative image" />
            </section>

            <ToastContainer className='toast-container' />
        </main>
    )
}

export default AuthPage;