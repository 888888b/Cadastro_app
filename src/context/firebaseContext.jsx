import { createContext, useState } from "react";
import { initializeApp } from 'firebase/app';


export const FirebaseContext = createContext();

export const FirebaseProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUserData, setCurrentUserData] = useState([]);
    const firebaseConfig = {
        apiKey: "AIzaSyBtuIzYiWYVg7j55olwUasnBSxS0ZOYEyo",
        authDomain: "login-project033.firebaseapp.com",
        projectId: "login-project033",
        databaseURL: "https://login-project033-default-rtdb.firebaseio.com",
        storageBucket: "login-project033.appspot.com",
        messagingSenderId: "184638576364",
        appId: "1:184638576364:web:f4773520ee157785f4b7c9",
        measurementId: "G-GLZLSQQMEK"
    };
    const firebaseApp = initializeApp(firebaseConfig);

    return(
        <FirebaseContext.Provider value={{isLoggedIn, setIsLoggedIn, firebaseApp, currentUserData, setCurrentUserData}}>
            {children}
        </FirebaseContext.Provider>
    );
};