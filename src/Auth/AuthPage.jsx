import './Auth.css';
import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegUser, FaGithub, FaRegEyeSlash } from "react-icons/fa";
import { RiLock2Line } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { getDatabase, ref, push, set, onValue, orderByChild, query, equalTo } from 'firebase/database';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FirebaseContext } from '../context/firebaseContext';

function AuthPage() {
    const [isEmailIconActive, setIsEmailIconActive] = useState('email-visible');
    const [isEyeIconActive, setIsEyeIconActive] = useState('eye-invisible');
    const [isLockIconActive, setIsLockIconActive] = useState('lock-visible');
    const [isUserIconActive, setIsUserIconActive] = useState('user-visible');
    const [activeForm, setActiveForm] = useState('sign-in');
    const formsRef = useRef([]);
    const inputsRef = useRef([]);
    const pageContainerRef = useRef(undefined);
    const navigate = useNavigate(undefined);    
    const app = useContext(FirebaseContext);

    const handleChangeForm = () => {
        if (activeForm === 'sign-in'){
            formsRef.current[0].style.opacity = 1;
            formsRef.current[0].style.transform = 'translateX(100%)';
            formsRef.current[1].style.transform = 'translateX(-100%)';
            formsRef.current[1].style.opacity = 0;
            setActiveForm('sign-up');
         }else{
            if (activeForm === 'sign-up'){
                formsRef.current[0].style.opacity = 0;
                formsRef.current[0].style.transform = 'translateX(0%)';
                formsRef.current[1].style.transform = 'translateX(0%)';
                formsRef.current[1].style.opacity = 1; 
                setActiveForm('sign-in');
            }  
         }
         resetInputValues(inputsRef.current);
    };

    const ShowPasswordInputValue = () => {
        if (activeForm === 'sign-in'){
            if (inputsRef.current){
                if (inputsRef.current[4].type === 'text'){
                    inputsRef.current[4].type = 'password';
                }else{
                    inputsRef.current[4].type = 'text';
                }
            }
        }else{
            if (inputsRef.current){
                if (inputsRef.current[2].type === 'text'){
                    inputsRef.current[2].type = 'password';
                }else{
                    inputsRef.current[2].type = 'text';
                }
            }
        }
    };

    const resetInputValues = (ref) => {
        ref.forEach(element => {
            element.value = null;
        });

        inputObserver(null, 'all');
    };
 
    const inputObserver = (e, type) => {
        if (e) {
            if (type === 'password'){
                setIsLockIconActive('lock-invisible')
                setIsEyeIconActive('eye-visible');
            }else{
                if (type === 'name'){
                    setIsUserIconActive('user-invisible');
                }else{
                    setIsEmailIconActive('email-invisible');
                }
            }
        }else{
            if (type === 'password'){
                setIsEyeIconActive('eye-invisible');
                setIsLockIconActive('lock-visible')
            }else{
                if (type === 'name'){
                    setIsUserIconActive('user-visible');
                }

                if (type === 'email'){
                    setIsEmailIconActive('email-visible');
                }

                if (type === 'all'){
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

        if (pageContainerRef.current){
            pageContainerRef.current.classList.add('element-opacity-02');
            setTimeout(() => {
                pageContainerRef.current.classList.remove('element-opacity-02');
            }, 2300);
        }
    };

    const handleSubmitForm = (formRef, formType, inputsValue) => {
        formRef.preventDefault();
        if (inputsValue[0] && inputsValue[1] && inputsValue[2] && inputsValue[3] && inputsValue[4]){
            if (formType === 'sign-in'){
                authenticateUser(inputsValue[3].value.toLowerCase(), inputsValue[4].value.toLowerCase());
            }else{
                if(formType === 'sign-up'){
                    addUserToDb(inputsValue[1].value.toLowerCase(), inputsValue[2].value.toLowerCase(), inputsValue[0].value);
                }
            }
        }
    }

    const addUserToDb = async (userEmail, userPassword, userName) => {
        const db = getDatabase(app.firebaseApp);
        const userRef = ref(db, 'users');
        const userID = push(userRef).key;
        const creationDate = new Date().toLocaleString().replace(',', '');

        try{
            const response = await findAccountByemail(userEmail);
            if (response){
                notify('Email já cadastrado!')
            }else{
                set(ref(db, `users/${userID}`) , {
                    name: userName,
                    email: userEmail,
                    password: userPassword,
                    created: creationDate
                        }).then(() => {
                        app.setIsLoggedIn(true);
                        app.setCurrentUserData({
                            name: userName,
                            email: userEmail,
                            password: userPassword,
                            created: creationDate });
                        navigate('/home');
                });
            }
        }catch (error){
            console.error(error);
        }
    };

    const authenticateUser = async (userEmail, userPassword) => {
        try{
            const response = await findAccountByemail(userEmail);
            if (response){
                const user = Object.values(response)[0];
                if (user.email === userEmail && user.password === userPassword) {
                    app.setIsLoggedIn(true);
                    app.setCurrentUserData(user);
                    navigate('/home');
                }else{
                    notify('E-mail ou senha incorretos');
                };
            }else{
                notify('Usuário não encontrado');
            }
        }catch (error){
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
                if (snapshot.val()){
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

    return(
        <main ref={pageContainerRef} className="auth-page">
            <section ref={(e) => {formsRef.current[0] = e}} className="sign-up-form auth-form">
                <div className="container-form">
                    <form onSubmit={(e) => {handleSubmitForm(e, 'sign-up', inputsRef.current)}} id="sign-up">
                        <h2>Cadastro</h2>

                        <div className="name-input-box">
                            <label htmlFor="user-name">Nome</label>
                            <div className="input-box">
                                <FaRegUser className={`user-icon ${isUserIconActive}`}/>
                                <input
                                    type="text"
                                    id='user-name'
                                    onChange={(e) => inputObserver(e.target.value, 'name')}
                                    ref={(e) => inputsRef.current[0] = e}
                                    placeholder="Nome de usuario"
                                    required
                                />
                            </div>
                        </div>

                        <div className="email-input-box">
                            <label htmlFor="sign-up-email">Email</label>
                            <div className="input-box">
                                <MdEmail className={`email-icon ${isEmailIconActive}`}/>
                                <input
                                    className="email"
                                    id="sign-up-email"
                                    type="text"
                                    onChange={(e) => inputObserver(e.target.value, 'email')}
                                    ref={(e) => inputsRef.current[1] = e}
                                    placeholder="Digite seu email"
                                    required/>
                            </div>
                        </div>

                        <div className="password-input-box">
                            <label htmlFor="sign-up-password">Senha</label>
                            <div className="input-box">
                                <RiLock2Line className={`lock-icon ${isLockIconActive}`}/>
                                
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
                                  ref={(e) => inputsRef.current[2] = e}
                                  required 
                                />
                            </div>
                        </div>

                        <div className="check-box">
                            <input id="btn-check1" type="checkbox" required/>
                            <label htmlFor="btn-check1">Eu concordo com os <span>Termos & Serviços</span></label>
                        </div>

                        <button className="btn-submit">Enviar</button>
                    </form>

                    <div className="account-exist">
                        <p>Ja tem uma conta ? <span onClick={handleChangeForm}>Entrar</span></p>
                    </div>
                </div>
            </section>

            <section ref={(e) => {formsRef.current[1] = e}} className="sign-in-form auth-form">
                <div className="container-form">
                    <form onSubmit={(e) => {handleSubmitForm(e, 'sign-in', inputsRef.current)}} id="sign-in">
                        <h2>Entrar</h2>

                        <div className="email-input-box">
                            <label htmlFor="sign-in-email">Email</label>
                            <div className="input-box">
                                <MdEmail className={`email-icon ${isEmailIconActive}`}/>
                                <input
                                    className="email"
                                    id="sign-in-email"
                                    type="text"
                                    onChange={(e) => inputObserver(e.target.value, 'email')}
                                    ref={(e) => inputsRef.current[3] = e}
                                    placeholder="Digite seu email"
                                    required/>
                            </div>
                        </div>

                        <div className="password-input-box">
                            <label htmlFor="sign-in-password">Senha</label>
                            <div className="input-box">
                                <RiLock2Line className={`lock-icon ${isLockIconActive}`}/>
                                
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
                                    ref={(e) => inputsRef.current[4] = e}
                                    required
                                />
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
                        <button>
                            <FcGoogle  className='google-icon'/>
                        </button>
                        <button>
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

            <ToastContainer className='toast-container'/>
        </main>
    )
}

export default AuthPage;