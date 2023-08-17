import React, { useEffect, useState } from 'react';
import { styled } from '@mui/system';
import { TextField, Button, Typography, Container, MenuItem, Input, InputLabel, Select, FormControl } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import { useNavigate, useParams } from 'react-router-dom';
import bookService from '../../service/bookservice';
import categoryService from '../../service/categorysevices';
import { RoutePaths } from '../utils/enum';
import ValidationErrorMessage from '../ValidationErrorMessage';
import Shared from '../utils/shared';

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

const Imagediv = styled("div")`
    margin-left: 1cm;
`;

const Editbook = () => {

    const navigate = useNavigate();
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Book Name is required"),
        price: Yup.number().required("Price is required"),
        categoryId: Yup.number().required("Category is required"),
        description: Yup.string().required("Description is required"),
        base64image: Yup.string().required("Image is required"),
    });

    const initialValues = {
        name: "",
        price: "",
        categoryId: 0,
        description: "",
        base64image: "",
    };

    const [categories, setCategories] = useState();
    const [initialValuestate, setinitialvaluestate] = useState(initialValues);
    const { id } = useParams();

    useEffect(() => {
        if (id) getbookbyID();
        categoryService.getAll().then((res) => {
            setCategories(res);
        })
            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const getbookbyID = () => {
        bookService.getById(Number(id)).then((res) => {
            setinitialvaluestate({
                id: res.id,
                name: res.name,
                price: res.price,
                categoryId: res.categoryId,
                description: res.description,
                base64image: res.base64image,
            })
        })
    }

    const redirect = () => {
        navigate(RoutePaths.book);
    }

    const onSubmit = (values) => {
        bookService
          .save(values)
          .then((res) => {
            toast.success(
              values.id
                ? Shared.messages.UPDATED_SUCCESS
                : "Record created successfully"
            );
            navigate("/book");
          })
          .catch((e) => toast.error(Shared.messages.UPDATED_FAIL));
      };
      
    const onSelectFile = (e, setFieldValue, setFieldError) => {
        const files = e.target.files;
        if (files?.length) {
            const fileSelected = e.target.files[0];
            const fileNameArray = fileSelected.name.split(".");
            const extension = fileNameArray.pop();
            if (["png", "jpg", "jpeg"].includes(extension?.toLowerCase())) {
                if (fileSelected.size > 50000) {
                    toast.error("File size must be less then 50KB");
                    return;
                }
                const reader = new FileReader();
                reader.readAsDataURL(fileSelected);
                reader.onload = function () {
                    setFieldValue("base64image", reader.result);
                };
                reader.onerror = function (error) {
                    throw error;
                };
            } else {
                toast.error("only jpg,jpeg and png files are allowed");
            }
        } else {
            setFieldValue("base64image", "");
        }
    };

    return (
        <Regdiv>
            <Container component="main">

                <FormContainer style={{ margin: '2rem' }}>
                    <Typography variant="h4">{id ? "Edit book" : "Add new book"}</Typography><hr/>

                    <Formik
                        initialValues={initialValuestate}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={onSubmit}
                    >
                        {({ values, errors, touched, handleBlur, setFieldError,
                            setFieldValue, handleChange,
                        }) => (
                            <Form>
                                <SectionTitle>Book Info</SectionTitle>
                                <FieldWrapper>
                                    <Field
                                        as={TextField}
                                        variant="outlined"
                                        fullWidth
                                        id="name"
                                        name="name"
                                        label="Name"
                                        // value={values.name}
                                        error={touched.name && !!errors.name}
                                        helperText={touched.name && errors.name}
                                    />
                                    <Field
                                        as={TextField}
                                        variant="outlined"
                                        fullWidth
                                        id="price"
                                        name="price"
                                        label="Price"
                                        // value={values.price}

                                        error={touched.price && !!errors.price}
                                        helperText={touched.price && errors.price}
                                    />

                                </FieldWrapper>

                                <FieldWrapper>
                                    <FormControl variant="outlined" marginBottom="1rem">
                                        <InputLabel id="category-label">Category</InputLabel>
                                        <Field
                                            as={Select}
                                            name="categoryId"
                                            labelId="category-label"
                                            label="Category"
                                        >
                                            {categories?.map((rl) => (
                                                <MenuItem value={rl.id} key={"category" + rl.id}>
                                                    {rl.name}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </FormControl>

                                    <Imagediv>
                                        {!values.base64image && (
                                            <>
                                                {" "}
                                                <label
                                                    htmlFor="contained-button-file"
                                                    className="file-upload-btn"
                                                >
                                                    <Button
                                                        variant="contained"
                                                        component="span"
                                                        className="btn pink-btn"
                                                    >
                                                        Upload Image
                                                    </Button>
                                                    <Input
                                                        id="contained-button-file"
                                                        type="file"
                                                        inputProps={{ className: "small" }}
                                                        onBlur={handleBlur}
                                                        onChange={(e) => {
                                                            onSelectFile(e, setFieldValue, setFieldError);
                                                        }}
                                                    />
                                                </label>
                                                <ValidationErrorMessage
                                                    message={errors.base64image}
                                                    touched={touched.base64image}
                                                />
                                            </>
                                        )}
                                        {values.base64image && (
                                            <div className="uploaded-file-name">
                                                <em>
                                                    <img src={values.base64image} alt="" />
                                                </em>
                                                image{" "}
                                                <span
                                                    onClick={() => {
                                                        setFieldValue("base64image", "");
                                                    }}
                                                >
                                                    x
                                                </span>
                                            </div>
                                        )}
                                    </Imagediv>
                                </FieldWrapper>
                                <FieldWrapper>
                                    <Field
                                        as={TextField}
                                        variant="outlined"
                                        fullWidth
                                        id="description"
                                        name="description"
                                        label="Description"

                                        error={touched.email && !!errors.email}
                                        helperText={touched.email && errors.email}
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

export default Editbook;