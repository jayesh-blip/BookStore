import Home from "./Home.jsx";
import Contact from "./Contact.jsx";
import Register from "./register/Register";
import {Routes, Route, Navigate } from "react-router-dom";
import Login from "./login/login";
import { RoutePaths } from "./utils/enum.js";
import { useAuthContext } from "./contexts/authcontext.jsx";
import Books from "./book/Books.jsx";
import Editbook from "./book/Editbook.jsx";
import User from "./user/user.jsx";
import EditUser from "./user/Edituser.jsx";
import Category from "./category/category.jsx";
import EditCategory from "./category/editcategory.jsx";
import UpdateProfile from "./updateProfile/Updateprofile.jsx";
import Cart from "./cart/Cart.jsx";
const Nav = () => {   
    const authContext=useAuthContext(); 
    
      const Redirect = <Navigate to={RoutePaths.login} />;

    return (
        <>
            <Routes>
              <Route path="" element={<Home />} />
              <Route path={RoutePaths.home} element={<Home />} />
              <Route path={RoutePaths.contact} element={<Contact />} />
              <Route path={RoutePaths.register} element={<Register />}/>
              <Route path={RoutePaths.login} element={<Login />}/>

              <Route path={RoutePaths.book} 
                element={authContext.user.id?(<Books />):Redirect} 
              />
              <Route path={RoutePaths.editbook} 
                element={authContext.user.id?(<Editbook />):Redirect} 
              />
              <Route path={RoutePaths.addbook} 
                element={authContext.user.id?(<Editbook />):Redirect} 
              />

              <Route path={RoutePaths.user} 
                element={authContext.user.id?(<User />):Redirect} 
              />
              <Route path={RoutePaths.edituser} 
                element={authContext.user.id?(<EditUser />):Redirect} 
              />  

              <Route path={RoutePaths.category} 
                element={authContext.user.id?(<Category />):Redirect} 
              />  
              <Route path={RoutePaths.addCategory} 
                element={authContext.user.id?(<EditCategory />):Redirect} 
              />  
              <Route path={RoutePaths.editCategory} 
                element={authContext.user.id?(<EditCategory />):Redirect} 
              /> 
              <Route path={RoutePaths.updateprofile} 
                element={authContext.user.id?(<UpdateProfile />):Redirect} 
              />  
              <Route path={RoutePaths.cart} 
                element={authContext.user.id?(<Cart />):Redirect} 
              /> 
              
          </Routes>
        </>
    )
};

export default Nav;