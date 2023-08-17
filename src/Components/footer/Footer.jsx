import styled from "@mui/system/styled";

const Footerp = styled("p")`
    height: 40px;
    color: black;
    font-family: Cambria;
    color:white;
    bottom: 0;
    width: 100%;
    position: relative;
    background-color: darkblue;
    margin: 0;
    text-align: center;
    `;


    
const Footer = () => {
    return (
        <>
            <Footerp><u>@all copyrights are reserved</u></Footerp>
        </>
    )
};

export default Footer;