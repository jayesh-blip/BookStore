import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Typography, TextField, Button,  Container } from "@material-ui/core";
import { useNavigate, useParams } from "react-router-dom";
import categoryService from "../../service/categorysevices";
import { Formik, Form, Field } from 'formik';
import { toast } from "react-toastify";
import Shared from "../utils/shared";
import { RoutePaths } from "../utils/enum";
import { styled } from '@mui/system';

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

const EditCategory = () => {
  const navigate = useNavigate();
  const initialValues = { name: "" };
  const [initialValueState, setInitialValueState] = useState(initialValues);
  const { id } = useParams();

  useEffect(() => {
    if (id) getCategoryById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Category Name is required"),
  });

  const getCategoryById = () => {
    categoryService.getById(Number(id)).then((res) => {
      setInitialValueState({
        id: res.id,
        name: res.name,
      });
    });
  };

  const redirect = () => {
    navigate(RoutePaths.category);
  }

  const onSubmit = (values) => {
    categoryService
      .save(values)
      .then((res) => {
        toast.success(Shared.messages.UPDATED_SUCCESS);
        navigate("/category");
      })
      .catch((e) => toast.error(Shared.messages.UPDATED_FAIL));
  };
  return (
    <Regdiv>
      <Container component="main">
        <FormContainer>
        <Typography variant="h4">{id ? "Edit" : "Add"} Category</Typography><hr/>

        <Formik
          initialValues={initialValueState}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={onSubmit}
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
                <SectionTitle>Category</SectionTitle>
                <FieldWrapper>
                  <Field
                    as={TextField}
                    fullWidth
                    variant="outlined"
                    id="name"
                    name="name"
                    label="First Name"
                    value={values.name}

                    error={touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                  />
                  

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
    </Regdiv>
  );
};

export default EditCategory;
