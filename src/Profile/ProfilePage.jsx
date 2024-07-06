import './Profile.css';
import { FaUserCircle } from "react-icons/fa";
import { useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../context/firebaseContext';
import { getDatabase, ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { FaPencil } from 'react-icons/fa6';

function Profile() {
    const app = useContext(FirebaseContext);
    const [userData, setUserData] = useState(undefined);

    const getUserData = async (userEmail) => {
        const db = getDatabase(app.firebaseApp);
        const userRef = ref(db, 'users');
        const queryDB = query(userRef, orderByChild('email'), equalTo(userEmail));
        await new Promise((resolve, reject) => {
            onValue(queryDB, (snapshot) => {
                if (snapshot.val()){
                    const data = Object.values(snapshot.val());
                    setUserData(data[0]);
                }
                resolve();
            }, (error) => {
                console.error(error);
                reject(error);
            });
        });

    };

    useEffect(() => {
        getUserData(app.currentUserData.email);
    },[]);

    return(
        userData &&
        <section className="profile-page">
            <section className="user-info">
                {userData.imageURL ? <img src={userData.imageURL}/> : <FaUserCircle className="user-icon"/>}
                <div className="user-data">

                    <div className="data-items">
                        <span>Endereço de e-mail</span>
                        <span>
                            {userData.email ? userData.email : 'Indisponivel'}
                        </span>
                        <FaPencil className='pencil-icon'/>
                    </div>

                    <div className="data-items">
                        <span>Criação</span>
                        <span>
                            {userData.created ? userData.created : 'Indisponivel'}
                        </span>
                        <FaPencil className='pencil-icon'/>
                    </div>

                    <div className="data-items">
                        <span>Senha</span>
                        <span>
                            {userData.password ? userData.password : 'Indisponivel'}
                        </span>
                        <FaPencil className='pencil-icon'/>
                    </div>

                    <div className="data-items">
                        <span>Nome de usuario</span>
                        <span>
                            {userData.name ? userData.name : 'Indisponivel'}
                        </span>
                        <FaPencil className='pencil-icon'/>
                    </div>

                </div>
            </section>

            <section className="more-details">

            </section>
        </section>
    );
};

export default Profile;