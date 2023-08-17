import React, { useEffect, useMemo, useState } from "react";
import { Button, FormControl, Grid, MenuItem, TextField, Typography } from "@material-ui/core";
import bookService from "../../service/bookservice";
import { styled } from '@mui/system';
import { Paper } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import categoryService from "../../service/categorysevices";
import { Pagination } from "@material-ui/lab";
import Shared from "../utils/shared";
import { useAuthContext } from "../contexts/authcontext";
import { toast } from "react-toastify";
import {  useCartContext } from "../contexts/cartcontext";



const GridContainer = styled(Grid)`
  position: relative;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 5px;
  margin:0.5cm;
`;

const BookCard = styled(Paper)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 94%;
  padding: 0.8rem;
  background-color: #ffffff;
  border-radius: 8px;
  align-items: center;
  text-align: center;
  // box-shadow: 0px 3px 3px -2px rgba(96, 70, 70, 0.455),
  //   0px 3px 4px 0px rgba(179, 82, 82, 0.688),
  //   0px 1px 8px 0px rgba(239, 80, 80, 0.612);
  // transition: transform 0.3s ease-in-out;

  // &:hover {
  //   transform: scale(1.05);
  // }
`;

const BookImage = styled("img")`
  width: 100%;
  height: 20vh;
  object-fit: cover;
  border-radius: 8px;
  object-fit: contain;
  margin-bottom: 0.6rem;
`;

const BookName = styled("span")`
  font-size: 1rem;
`;

const BookSub = styled("span")`
  font-size: 0.9rem;
`;

const Coldivleft = styled("div")`
float: left;
`;

const Coldivright = styled("div")`
    float: right;  
`;


const Pagewrapper = styled("div")`
    & ul{
        float: center;
        justify-content: center;
        align-items: center;
        align-content: center;
        padding:0.3cm;
    }
`;


const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    root: {
        width: '100%',
    },
    paper: {
        width: '80%',
        marginBottom: theme.spacing(3),
        marginTop: '1cm',
        paddingTop: '0.5cm',

    },

}));

const defaultFilter = {
    pageIndex: 1,
    pageSize: 10,
    keyword: "",
};


const BookGrid = () => {
    const classes = useStyles();
    const authContext = useAuthContext();
    const cartContext = useCartContext();


    const [bookResponse, setBookResponse] = useState({
        pageIndex: 0,
        pageSize: 10,
        totalPages: 1,
        items: [],
        totalItems: 0,
    });

    const [categories, setCategories] = useState([]);
    const [sortBy, setSortBy] = useState();
    const [filters, setFilters] = useState(defaultFilter);

    useEffect(() => {
        getAllCategories();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (filters.keyword === "") delete filters.keyword;
            searchAllBooks({ ...filters });
        }, 500);
        return () => clearTimeout(timer);
    }, [filters]);

    const searchAllBooks = (filter) => {
        bookService.getAll(filter).then((res) => {
            setBookResponse(res);
        });
    };

    const getAllCategories = async () => {
        await categoryService.getAll().then((res) => {
            if (res) {
                setCategories(res);
            }
        });
    };

    const books = useMemo(() => {
        const bookList = [...bookResponse.items];
        if (bookList) {
            bookList.forEach((element) => {
                element.category = categories.find(
                    (a) => a.id === element.categoryId
                )?.name;
            });
            return bookList;
        }
        return [];
    }, [categories, bookResponse]);

    const sortBooks = (e) => {
        setSortBy(e.target.value);
        const bookList = [...bookResponse.items];

        bookList.sort((a, b) => {
            if (a.name < b.name) {
                return e.target.value === "a-z" ? -1 : 1;
            }
            if (a.name > b.name) {
                return e.target.value === "a-z" ? 1 : -1;
            }
            return 0;
        });
        setBookResponse({ ...bookResponse, items: bookList });
    };

    const addBooktoCart = (book) => {
        Shared.addToCart(book, authContext.user.id).then((res) => {
            if (res.error) {
                toast.error(res.message);
            }
            else {
                cartContext.updateCart();
                toast.success(res.message);
                console.log(cartContext.cartData);
                console.log("update");
            }
        });
    };

    return (

        <div >
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <Typography variant="h4">Book-Listing</Typography><hr />

                    <GridContainer>
                        <Grid>
                            <div>
                                <Coldivleft>
                                    <span>Total-{bookResponse.totalItems}</span>
                                </Coldivleft>
                                <Coldivright>
                                    <TextField
                                        style={{ width: '400px' }}

                                        placeholder="Search.."
                                        variant="outlined"
                                        inputProps={{ className: "small" }}
                                        onChange={(e) => {
                                            setFilters({
                                                ...filters,
                                                keyword: e.target.value,
                                                pageIndex: 1
                                            })
                                        }}
                                    >
                                    </TextField>

                                    <FormControl className={classes.formControl} >
                                        <InputLabel htmlFor="select">Sort By</InputLabel>
                                        <Select onChange={sortBooks} value={sortBy}>
                                            <MenuItem value="a-z">A - Z</MenuItem>
                                            <MenuItem value="z-a">Z - A</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Coldivright>
                            </div>
                        </Grid>
                        <Grid container spacing={6} className="book-grid">
                            {books.map((book) => (
                                <Grid item xs={4} key={book.id} marginBottom="2vh">
                                    <BookCard elevation={3}>
                                        <BookImage
                                            src={book.base64image}
                                            alt={book.name}
                                            className="book-image"
                                            style={{ backgroundColor: 'white' }}
                                        />
                                        <BookName variant="h6" style={{ fontSize: "1rem" }}>
                                            {book.name}
                                        </BookName>
                                        <BookSub variant="subtitle1">
                                            {book.description.slice(0, 30)}
                                        </BookSub>
                                        <BookSub variant="subtitle1">{book.price} ₹</BookSub>
                                        <Button 
                                            className=" btn"
                                            variant="contained" 
                                            style={{ backgroundColor: "darkblue" ,color:"white"}} onClick={() => addBooktoCart(book)}
                                        >
                                            Add to Cart
                                        </Button>
                                    </BookCard>
                                </Grid>
                            ))}

                        </Grid>
                    </GridContainer>
                    <Pagewrapper>
                        <Pagination
                            count={bookResponse.totalPages}
                            page={filters.pageIndexs}
                            onChange={(e, newpage) => {
                                setFilters({ ...defaultFilter, pageIndex: newpage })
                            }
                            }
                        />
                    </Pagewrapper>
                </Paper>
            </div>
        </div>
    );
};

export default BookGrid