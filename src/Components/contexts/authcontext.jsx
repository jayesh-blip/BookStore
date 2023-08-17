import { React, createContext, useEffect, useState, useContext } from "react";
import Shared from "../utils/shared";
import { RoutePaths } from "../utils/enum";
import { useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";

const initialUserValue = {
    id: 0,
    email: "",
    firstName: "",
    lastName: "",
    roleId: 0,
    role: "",
    password: "",
};


const initialState = {
    setUser: () => { },
    user: initialUserValue,
    signOut: () => { },
    appInitialize: false,

};

export const AuthContext = createContext(initialState);

export const AuthWrapper = ({ children }) => {


    const [user, _setUser] = useState(initialUserValue);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const setUser = (user) => {
        localStorage.setItem(Shared.localStorageKeys.USER, JSON.stringify(user));
        _setUser(user);
        console.log(user);
    };

    const signOut = () => {
        localStorage.removeItem(Shared.localStorageKeys.USER);
        _setUser(initialUserValue);
        console.log(user);
    };

    useEffect(() => {
        const cache = JSON.parse(localStorage.getItem(Shared.localStorageKeys.USER)) || initialUserValue;
        if (cache.id) {
            _setUser(cache);
        } else {
            navigate(RoutePaths.login);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (pathname === RoutePaths.login && user.id) {
            navigate(RoutePaths.home);
        }
        if (!user.id) {
            return;
        }
        // const access = Shared.hasAccess({ pathname, user });
        // if (!access) {
        //     toast.warning("Sorry, you are not authorized to access this page");
        //     navigate(RoutePaths.home);
        //     return;
        // }
            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, user]);

    let value = {
        user,
        setUser,
        signOut,

    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
    return useContext(AuthContext);
};