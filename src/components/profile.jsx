import { FaUserCircle } from "react-icons/fa";

function Profile({userDat}) {
    return(
        <main className='profile-page'>
            <section className="user-section">
                <h1>Perfil</h1>
                <div className="profile-user-image">
                    {userDat.photoURL ? (
                        <img src={userDat.photoURL} alt="" srcset=""/>
                    ): (
                        <FaUserCircle className="user-icon"/>
                    )}
                </div>

                <section className="profile-user-details">

                    <div className="user-info-box">
                        <label htmlFor="">Nome de Usuario</label>
                        <div className="name-box user-information">
                            {userDat.displayName ? (
                                <h2>{userDat.displayName}</h2>
                            ):(
                                <h2>user test</h2>
                            )}
                        </div>
                    </div>

                    <div className="user-info-box">
                        <label htmlFor="">Email</label>
                        <div className="email-box user-information">
                            {userDat.email ? (
                                <h2>{userDat.email}</h2>
                            ): (
                                <h2>Usertest123@gmail.com</h2>
                            )}
                        </div>
                    </div>
                    
                    <div className="user-info-box">
                        <label htmlFor="">Data de Criação</label>
                        <div className="date-box user-information">
                            {userDat.metadata.creationTime ? (
                                <h2>{userDat.metadata.creationTime}</h2>
                            ): (
                                <h2>xx/xx/xxxx</h2>
                            )}
                        </div>
                    </div>
                </section>
            </section>
        </main>
    )
}

export default Profile;