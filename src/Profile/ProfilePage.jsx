import './Profile.css';
import { FaUserCircle } from "react-icons/fa";
import { useContext } from 'react';
import { FirebaseContext } from '../context/firebaseContext';

function Profile() {
    const userdata = useContext(FirebaseContext);

    return(
        <section className="profile-page">
            <section className="user-info">
                <FaUserCircle className="user-icon"/>
                <div className="user-data">

                    <div className="data-items">
                        <span>Endereço de e-mail</span>
                        <span>
                            {userdata.currentUserData.email ? userdata.currentUserData.email : 'Indisponivel'}
                        </span>
                    </div>

                    <div className="data-items">
                        <span>Criação</span>
                        <span>
                            {userdata.currentUserData.created ? userdata.currentUserData.created : 'Indisponivel'}
                        </span>
                    </div>

                    <div className="data-items">
                        <span>Senha</span>
                        <span>
                            {userdata.currentUserData.password ? userdata.currentUserData.password : 'Indisponivel'}
                        </span>
                    </div>

                </div>
            </section>

            <section className="more-details">

            </section>
        </section>
    );
};

export default Profile;