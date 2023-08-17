import { BrowserRouter } from "react-router-dom";
import Nav from "./Components/Nav.jsx";
import "./assets/css/style.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Components/footer/Footer';
import Header from "./Components/header/header";
import { AuthWrapper } from "./Components/contexts/authcontext.jsx";
import { CartWrapper } from "./Components/contexts/cartcontext"
import loader from "../src/assets/images/load.gif";



function App() {

  return (
    <>
      <BrowserRouter>
        <AuthWrapper>
          <CartWrapper>
            <div className="loader-wrapper">
              <img src={loader} width="100px" color="blue" alt="loader" />
            </div>
            <Header />
            <Nav />
            <Footer />
          </CartWrapper>
        </AuthWrapper>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}


export default App;
