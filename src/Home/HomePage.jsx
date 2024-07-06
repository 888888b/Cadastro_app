import './Home.css';
import { useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../context/firebaseContext';
import { getDatabase, ref, onValue} from 'firebase/database';

function Home(){
    const app = useContext(FirebaseContext);
    const [usersList, setUsersList] = useState([]);

    const getAllUsers = async () => {
        let response = null;
        const db = getDatabase(app.firebaseApp);
        const usersRef = ref(db, 'users');
        await new Promise((resolve, reject) => {
            onValue(usersRef, (snapshot) => {
                if (snapshot.val()){
                    response = snapshot.val();
                }
                resolve();
            }, (error) => {
                console.error(error);
                reject(error);
            });
        });

        if (response){
            setUsersList(Object.values(response));
        }else{
           undefined 
        }
    };

    useEffect(() => {
        getAllUsers();
    },[]);

    return(
        <section className="home-container">
            <h1>Tabela de usuarios</h1>
            <div className='users-table'>

                <span className='element-left'>Nome</span>
                <span className='element-center'>E-mail</span>
                <span className='element-center'>Senha</span>
                <span className='element-right'>Criação</span>
        
                {usersList.map(user => (
                    <>
                        <p className='element-left'>{user.name}</p>
                        <p className='element-center'>{user.email}</p>
                        <p className='element-center'>{user.password ? user.password.replace(/./g, '*') : '*******'}</p>
                        <p className='element-right'>{user.created}</p>
                    </>
                ))}
            </div>

            <div className='mobile-table'>
 
                {usersList.map(user => (
                    <div className='users-data'>
                        <span className='element-left'>Nome</span>
                        <p className='element-right'>{user.name}</p>
                        <span className='element-left'>E-mail</span>
                        <p className='element-right'>{user.email}</p>
                        <span className='element-left'>Senha</span>
                        <p className='element-right'>{user.password ? user.password.replace(/./g, '*') : '*******'}</p>
                        <span className='element-left'>Criação</span>
                        <p className='element-right'>{user.created}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Home;