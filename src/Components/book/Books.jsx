import React, { useEffect, useState } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from "@material-ui/core";
import bookService from "../../service/bookservice";
import { Paper } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import categoryService from "../../service/categorysevices";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ConfirmationDialog from "../utils/confirmDialog";
import shared from "../utils/shared";
import { RoutePaths } from "../utils/enum";






const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },

    paper: {
        width: '66%',
        marginBottom: theme.spacing(3),
        marginTop: '1cm',
        padding: '1cm',
        paddingTop: '0.5cm'
    },
    table: {
        minWidth: 750,
    },


}));

const defaultFilter = {
    pageIndex: 1,
    pageSize: 10,
    keyword: "",
};


const Books = () => {
    const navigate = useNavigate();

    const classes = useStyles();
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [deleteBookId, setDeleteBookId] = useState(null);


    const [bookResponse, setBookResponse] = useState({
        pageIndex: 0,
        pageSize: 10,
        totalPages: 1,
        items: [],
        totalItems: 0,
    });

    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState(defaultFilter);
    const columns = [
        { id: "name", label: "Book Name", minWidth: 100 },
        { id: "price", label: "Price", minWidth: 100 },
        { id: "category", label: "Category", minWidth: 100 },
    ];

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




    const handleDeleteConfirmationOpen = (bookId) => {
        setDeleteBookId(bookId);
        setDeleteConfirmationOpen(true);
    };

    const handleDeleteConfirmationClose = () => {
        setDeleteBookId(null);
        setDeleteConfirmationOpen(false);
    };

    const handleDeleteBook = async () => {
        try {
            await bookService.DeleteBook(deleteBookId);
            toast.success("Book deleted successfully");
            setDeleteConfirmationOpen(false);
            setDeleteBookId(null);
            setFilters({ ...filters, pageIndex: 1 });
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete book");
        }
    };

    return (

        <div >
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <Typography variant="h4">Books</Typography>
                    <hr />
                    <Button
                        style={{ float: "right", marginRight: '0.3cm', height: '55px' }}
                        type="button"
                        className="btn pink-btn"
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate(RoutePaths.addbook)}
                    >
                        Add
                    </Button>
                    <TextField
                        style={{ float: "right", width: '400px', marginRight: '0.3cm' }}
                        id="text"
                        name="text"
                        placeholder="Search..."
                        variant="outlined"
                        inputProps={{ className: "small" }}
                        onChange={(e) => {
                            setFilters({ ...filters, keyword: e.target.value, pageIndex: 1 });
                        }}
                    />
                    <TableContainer>
                        <Table className={classes.table}>
                            <TableHead >

                                <TableRow>
                                    <TableCell></TableCell>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            <b>{column.label}</b>
                                        </TableCell>
                                    ))}
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {bookResponse?.items?.map((row, index) => (
                                    <TableRow key={row.id}>
                                        <TableCell></TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.price}</TableCell>
                                        <TableCell>
                                            {categories.find((c) => c.id === row.categoryId)?.name}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => {
                                                    navigate(`/edit-book/${row.id}`)
                                                }}
                                                style={{ marginRight: "8px" }}
                                            >

                                                Edit
                                            </Button>

                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => handleDeleteConfirmationOpen(row.id)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={bookResponse.totalItems}
                        rowsPerPage={filters.pageSize || 0}
                        page={filters.pageIndex - 1}
                        onPageChange={(e, newpage) => {
                            setFilters({ ...filters, pageIndex: newpage + 1 })
                        }
                        }
                        onRowsPerPageChange={(e) => {
                            setFilters({ ...filters, pageIndex: 1, pageSize: Number(e.target.value) })

                        }}
                    />
                </Paper>
            </div>



            <ConfirmationDialog
                open={deleteConfirmationOpen}
                onClose={handleDeleteConfirmationClose}
                onConfirm={handleDeleteBook}
                title="Delete Book"
                description={shared.messages.BOOK_DELETE}
            />


        </div>
    );
};

export default Books;