import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { styled } from '@mui/system';

import { TextField, Button, Typography, InputLabel, Select, FormControl, MenuItem, Container } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import { useNavigate, useParams } from "react-router-dom";
import userService from "../../service/userservice";
import { toast } from "react-toastify";
import Shared from '../utils/shared';
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

const EditUser = () => {
  const [roles, setRoles] = useState([]);
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const initialValues = {
    id: 0,
    email: "",
    lastName: "",
    firstName: "",
    roleId: 3,
  };
  const [initialValueState, setInitialValueState] = useState(initialValues);
  const { id } = useParams();

  useEffect(() => {
    getRoles();
  }, []);

  useEffect(() => {
    if (id) {
      getUserById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (user && roles.length) {
      const roleId = roles.find((role) => role.name === user?.role)?.id;
      setInitialValueState({
        id: user.id,
        email: user.email,
        lastName: user.lastName,
        firstName: user.firstName,
        roleId,
        password: user.password,
      });
    }
  }, [user, roles]);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address format")
      .required("Email is required"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    roleId: Yup.number().required("Role is required"),
  });

  const redirect = () => {
    navigate(RoutePaths.user);
  }
  const getRoles = () => {
    userService.getAllRoles().then((res) => {
      if (res) {
        setRoles(res);
      }
    });
  };

  const getUserById = () => {
    userService.getById(Number(id)).then((res) => {
      if (res) {
        setUser(res);
      }
    });
  };

  const onSubmit = (values) => {
    const updatedValue = {
      ...values,
      role: roles.find((r) => r.id === values.roleId).name,
    };
    userService
      .update(updatedValue)
      .then((res) => {
        if (res) {
          toast.success(Shared.messages.UPDATED_SUCCESS);
          navigate("/user");
        }
      })
      .catch((e) => toast.error(Shared.messages.UPDATED_FAIL));
  };
  return (
    <Regdiv>
      <Container component="main">
        <FormContainer>
          <Typography variant="h4">Edit User</Typography><hr/>
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
              <Form>
                <SectionTitle>User information</SectionTitle>
                <FieldWrapper>
                  <Field
                    as={TextField}
                    fullWidth
                    variant="outlined"
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    value={values.firstName}

                    error={touched.firstName && !!errors.firstName}
                    helperText={touched.firstName && errors.firstName}
                  />
                  <Field
                    as={TextField}
                    variant="outlined"
                    fullWidth

                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    value={values.lastName}

                    error={touched.lastName && !!errors.lastName}
                    helperText={touched.lastName && errors.lastName}
                  />

                </FieldWrapper>

                
                <FieldWrapper>
                  <Field
                    as={TextField}
                    fullWidth
                    variant="outlined"
                    id="email"
                    name="email"
                    label="Email Address"
                    value={values.email}

                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                  />
                  <FormControl variant="outlined" fullWidth marginBottom="1rem">
                  <InputLabel id="role-label">Role</InputLabel>

                    <Field
                      as={Select}
                      name="roleId"
                      id={"roleId"}
                      label="Role"
                    >
                      {roles.length > 0 &&
                        roles.map((role) => (
                          <MenuItem value={role.id} key={"name" + role.id}>
                            {role.name}
                          </MenuItem>
                        ))}
                    </Field>
                  </FormControl>
                </FieldWrapper>

                <Addbutton type="submit" variant="contained" >
                  Save
                </Addbutton>
                <Addbutton onClick={redirect} variant="contained" >
                  Cancle
                </Addbutton>
              </Form>
            )}
          </Formik>
        </FormContainer>
      </Container>
    </Regdiv >
  );
};

export default EditUser;
