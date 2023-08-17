import React, { useContext, useState } from "react";
import { Typography, TextField, Button, Container } from "@material-ui/core";
import { Formik, Form, Field } from 'formik';
import * as Yup from "yup";
import { styled } from '@mui/system';

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext, useAuthContext } from "../contexts/authcontext";
import userService from "../../service/userservice";
import Shared from "../utils/shared";
import { RoutePaths } from "../utils/enum";

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

const Addbutton = styled(Button)`
  align-self: flex-start;
  margin-top: 2rem;
  color:white;
  background-color: darkblue;
  margin-left:0.3cm;

`;

const Regdiv = styled("div")`
    margin-bottom: 2cm;
`;


const UpdateProfile = () => {
    const authContext = useAuthContext();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const initialValueState = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        newPassword: "",
        confirmPassword: "",
    };


    const [updatePassword, setUpdatePassword] = useState(false);

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Invalid email address format")
            .required("Email is required"),
        firstName: Yup.string().required("First Name is required"),
        lastName: Yup.string().required("Last Name is required"),
        newPassword: Yup.string().min(5, "Minimum 5 charactor is required"),
        confirmPassword: updatePassword
            ? Yup.string()
                .required("Must required")
                .oneOf([Yup.ref("newPassword")], "Passwords is not match")
            : Yup.string().oneOf([Yup.ref("newPassword")], "Passwords is not match"),
    });

    const onSubmit = async (values) => {
        const password = values.newPassword ? values.newPassword : user.password;
        delete values.confirmPassword;
        delete values.newPassword;

        const data = Object.assign(user, { ...values, password });
        delete data._id;
        delete data.__v;
        const res = await userService.updateProfile(data);
        if (res) {
            authContext.setUser(res);
            toast.success(Shared.messages.UPDATED_SUCCESS);
            navigate("/");
        }
    };

    const redirect = () => {
        navigate(RoutePaths.home);
    }

    
    return (
        <Regdiv>
      <Container component="main">
        <FormContainer>
                <Typography variant="h4">Update Profile</Typography><hr/>
                <Formik
                    initialValues={initialValueState}
                    validationSchema={validationSchema}
                    enableReinitialize={true}
                    onSubmit={onSubmit}
                    validator={() => ({})}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                    }) => (
                        <>
                            <Form>
                                <SectionTitle>User information</SectionTitle>
                                <FieldWrapper>
                                    <Field
                                        as={TextField}
                                        fullWidth
                                        variant="outlined"
                                        id="first-name"
                                        name="firstName"
                                        label="First Name "
                                        value={values.firstName}

                                        error={touched.firstName && !!errors.firstName}
                                        helperText={touched.firstName && errors.firstName}
                                    />
                                    <Field
                                        as={TextField}
                                        fullWidth
                                        id="last-name"
                                        name="lastName"
                                        label="Last Name *"
                                        variant="outlined"
                                        value={values.lastName}

                                        error={touched.lastName && !!errors.lastName}
                                        helperText={touched.lastName && errors.lastName}
                                    />

                                </FieldWrapper>


                                <FieldWrapper>
                                    <Field
                                        as={TextField}
                                        fullWidth
                                        id="email"
                                        name="email"
                                        label="Email *"
                                        variant="outlined"
                                        value={values.email}

                                        error={touched.email && !!errors.email}
                                        helperText={touched.email && errors.email}
                                    />


                                </FieldWrapper>
                                <FieldWrapper>
                                    <Field
                                        as={TextField}
                                        fullWidth
                                        id="newPassword"
                                        name="newPassword"
                                        label="New Password "
                                        variant="outlined"
                                        value={values.newPassword}
                                        onChange={(e) => {
                                            e.target.value !== ""
                                                ? setUpdatePassword(true)
                                                : setUpdatePassword(false);
                                            handleChange(e);
                                        }}


                                        error={touched.newPassword && !!errors.newPassword}
                                        helperText={touched.newPassword && errors.newPassword}
                                    />
                                    <Field
                                        as={TextField}
                                        fullWidth
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        label="Confirm Password "
                                        variant="outlined"
                                        value={values.confirmPassword}

                                        error={touched.confirmPassword && !!errors.confirmPassword}
                                        helperText={touched.confirmPassword && errors.confirmPassword}
                                    />
                                </FieldWrapper>

                                <Addbutton type="submit" variant="contained" >
                                    Save
                                </Addbutton>
                                <Addbutton onClick={redirect} variant="contained" >
                                    Cancle
                                </Addbutton>
                            </Form>
                        </>
                    )}
                </Formik>
            </FormContainer>
        </Container>
        </Regdiv>
    );
};

export default UpdateProfile;
