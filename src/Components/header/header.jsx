import { Outlet, NavLink } from "react-router-dom";
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import styled from "@mui/system/styled";
import { useAuthContext } from "../contexts/authcontext";
import { RoutePaths } from "../utils/enum";
import { useMemo } from "react";
import Shared from "../utils/shared";
import { Button } from "@material-ui/core";
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import Searchbar from "./seachbar";


const Navull = styled("ul")`
    position:relative;
    font-size: 19px;
    align-items: center;
    list-style-type: none;
    margin: 0;
    padding-right: 30px;
    overflow: hidden;
    background-color: darkblue;
    box-shadow: 0 2px 4px 3px rgba(0,0,0,.5);

    `;


const Navli = styled("li")`
    float: right;
    margin-left: 5px;
    margin:1px;
    bottom:0;

    & a{
        display: block;
        color: white;
        text-align: center;
        padding: 16px 10px;
        text-decoration: none;
    }
    & a:hover{
        color: white;
        font-size:21px;
        text-decoration: underline;
        

    }
    & svg:hover{
        // background-color: rgb(8, 82, 172);
        text-decoration: underline;
    }
    & Button{
        color:white;
        border-color: white;

        // background-color: rgb(25, 25, 203);
        
    }
    & Button:hover{
        text-decoration: underline;
        // background-color: rgb(8, 82, 172);
    }
`;




const Header = () => {
    const authContext = useAuthContext();

    const items = useMemo(() => {
        return Shared.NavigationItems.filter(
            (item) => !item.access.length || item.access.includes(authContext.user.roleId)
        )
    }, [authContext.user])

    return (

        <>
            <nav>
                <Navull>
                    <Navli style={{ float: "left" }} >
                        <NavLink to="">
                            <HomeRoundedIcon style={{ fontSize: '27px' }} />
                        </NavLink>
                    </Navli>

                    {!authContext.user.id ? (
                        <>
                        <Navli >
                            <NavLink to={RoutePaths.login} >
                                <Button variant="outlined" color="primary">
                                    <PowerSettingsNewIcon />- Login
                                </Button>                            
                            </NavLink>
                        </Navli>
                        <Navli >
                            <NavLink to={RoutePaths.register} >
                                <Button variant="outlined" color="primary">
                                    <PowerSettingsNewIcon />- Register
                                </Button>                            
                            </NavLink>
                        </Navli>
                        </>
                    ) :
                        <div>

                            <div class="icons">
                                <Navli  >
                                    <NavLink onClick={authContext.signOut} to={RoutePaths.login}>
                                        <Button variant="outlined" color="primary">
                                            <PowerSettingsNewIcon />- Logout
                                        </Button>
                                    </NavLink>

                                </Navli>
                                <Navli >
                                    <NavLink to={RoutePaths.cart}>
                                    <Button variant="outlined" color="primary">
                                    <AddShoppingCartIcon  />- Cart
                                        </Button>
                                        
                                    </NavLink>
                                </Navli>
                            </div>

                            <Navli >
                                <NavLink to={RoutePaths.contact}>Contact</NavLink>
                            </Navli>


                            {items.map((item, index) => (
                                <Navli key={index}>
                                    <NavLink to={item.route}>
                                        {item.name}
                                    </NavLink>
                                </Navli>
                            ))}
                        </div>
                    }

                </Navull>

            </nav>
            {/* {authContext.user.id ? <Searchbar /> : ""} */}
            <Searchbar/>
            <Outlet />

        </>
    )
};

export default Header;