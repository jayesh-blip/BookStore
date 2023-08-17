import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, TextField, makeStyles, Paper } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { Button } from "@material-ui/core";
import { toast } from "react-toastify";

import { defaultFilter, RecordsPerPage } from "../utils/constant";
import categoryService from "../../service/categorysevices";
import ConfirmationDialog from "../utils/confirmDialog";
import Shared from '../utils/shared';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },

    paper: {
        width: '60%',
        marginBottom: theme.spacing(3),
        marginTop: '1cm',
        padding: '1cm',
        paddingTop: '0.5cm'
    },
    table: {
        minWidth: 750,
    },
}));

const Category = () => {
    const classes = useStyles();

    const [filters, setFilters] = useState(defaultFilter);
    const [categoryRecords, setCategoryRecords] = useState({
        pageIndex: 0,
        pageSize: 10,
        totalPages: 1,
        items: [],
        totalItems: 0,
    });
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(0);

    const navigate = useNavigate();
    useEffect(() => {
        const timer = setTimeout(() => {
            if (filters.keyword === "") delete filters.keyword;
            searchAllCategories({ ...filters });
        }, 500);
        return () => clearTimeout(timer);
    }, [filters]);

    const searchAllCategories = (filters) => {
        categoryService.getAll(filters).then((res) => {
            setCategoryRecords(res);
        });
    };

    const columns = [{ id: "name", label: "Category Name", minWidth: 100 }];

    const onConfirmDelete = () => {
        categoryService
            .deleteCategory(selectedId)
            .then((res) => {
                toast.success(Shared.messages.DELETE_SUCCESS);
                setOpen(false);
                setFilters({ ...filters });
            })
            .catch((e) => toast.error(Shared.messages.DELETE_FAIL));
    };
    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
            <Typography variant="h4">Category</Typography><hr/>
                <Button
                    style={{ float: "right", marginRight: '0.3cm', height: '55px' }}
                    type="button"
                    className="btn pink-btn"
                    variant="outlined"
                    color="primary"
                    
                    onClick={() => navigate("/add-category")}
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
                    <Table aria-label="simple table">
                        <TableHead>
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
                                <TableCell></TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody   >

                            {categoryRecords?.items?.map((row, index) => (
                                <TableRow key={row.id}>
                                    <TableCell></TableCell>
                                    <TableCell>{row.name}</TableCell>

                                    <TableCell>
                                        <Button
                                            style={{ float: "right", marginRight: "8px" }}
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => {
                                                setOpen(true);
                                                setSelectedId(row.id ?? 0);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            style={{ float: "right", marginRight: "8px" }}
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => {
                                                navigate(`/edit-category/${row.id}`);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    </TableCell>
                                    <TableCell></TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={RecordsPerPage}
                    component="div"
                    count={categoryRecords?.totalItems || 0}
                    rowsPerPage={filters.pageSize || 0}
                    page={filters.pageIndex - 1}
                    onPageChange={(e, newPage) => {
                        setFilters({ ...filters, pageIndex: newPage + 1 });
                    }}
                    onRowsPerPageChange={(e) => {
                        setFilters({
                            ...filters,
                            pageIndex: 1,
                            pageSize: Number(e.target.value),
                        });
                    }}
                />

                <ConfirmationDialog
                    open={open}
                    onClose={() => setOpen(false)}
                    onConfirm={() => onConfirmDelete()}
                    title="Delete Category"
                    description={Shared.messages.CATEGORY_DELETE}
                />
            </Paper>
        </div>

    );
};

export default Category;
