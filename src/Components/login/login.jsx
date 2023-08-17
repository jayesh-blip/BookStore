import React from 'react';
import { styled } from '@mui/system';
import { TextField, Button, Typography, Container } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import authService from '../../service/authsevice';
import {  NavLink, useNavigate, } from 'react-router-dom';
import { useAuthContext } from '../contexts/authcontext';
import { RoutePaths } from '../utils/enum';


const validationSchema = Yup.object().shape({
  
  email: Yup.string()
    .email("Invalid email")
    .required("Required"),

  password: Yup.string()
    .min(4, "Password is too short - should be 8 chars minimum.")
    .required("No Password provided."),
  
});

const initialValues = {
  
  email: '',
  roleId: '',
 
};

const FormContainer = styled('div')`
  display: flex;
  flex-direction: column;
  margin: 2rem;
`;

const SectionTitle = styled('h2')`
  margin-bottom: 2.5rem;
  font-weight: 400;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    bottom: -13px;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const FieldWrapper = styled('div')`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const LoginButton = styled(Button)`
  align-self: flex-start;
  margin-top: 2rem;
  color:white;
  background-color: darkblue;
`;

const Login = () => {
  const authContext = useAuthContext();
  const navigate =useNavigate();
 
  const handleSubmit = (data) => {

    // console.log(data);
    delete data.firstName;
    delete data.id;
    delete data.confirmPassword;
    authService.login(data)
      .then((res) => {
        // navigate("/login");
        // console.log("Registered!!");
        toast.success("Successfully login");
        authContext.setUser(res);
        navigate(RoutePaths.home);
      })
      .catch((error) => {
        toast.error();
      })
  };

  return (
    <Container component="main">

      {/* <Breadcrumbs aria-label="breadcrumb">
      <NavLink style={{ color: 'black' }} to="/home" >home</NavLink>

        <Typography color="textPrimary">Login </Typography>
      </Breadcrumbs> */}

      <FormContainer style={{ margin: '2rem' }}>
        <Typography component="h1" variant="h4" align="center" marginY='4rem'>
          <u>Sign in to your Account</u>
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              
              <SectionTitle>Login info</SectionTitle>

              <FieldWrapper>
                <Field
                  as={TextField}
                  variant="outlined"
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  // value={values.email}

                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />
                
             
                <Field
                  as={TextField}
                  variant="outlined"
                  fullWidth
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  // value={values.password}

                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                />
                
              </FieldWrapper>

              <LoginButton type="submit" variant="contained" >
                login
              </LoginButton>
              <SectionTitle></SectionTitle>
              <NavLink to="/register" style={{ color: "darkblue" }}>New user? Create Account here</NavLink>
            </Form>
          )}

        </Formik>
      </FormContainer>
    </Container>
  );
};

export default Login;