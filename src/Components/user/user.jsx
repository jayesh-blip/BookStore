import React, { useEffect, useState } from "react";
import { defaultFilter, RecordsPerPage } from "../utils/constant";
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

import Shared from '../utils/shared';
import userService from "../../service/userservice";
import { useAuthContext } from "../contexts/authcontext";
import ConfirmationDialog from "../utils/confirmDialog";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    
    paper: {
        width: '75%',
        // marginBottom: theme.spacing(3),
        margin: '1cm',
        padding: '1cm',
        paddingTop:'0.5cm',
        paddingBottom:'0.3cm'

    },
    table: {
        minWidth: 750,
    },
}));




const User = () => {
    const classes = useStyles();

    const authContext = useAuthContext();
    const [filters, setFilters] = useState(defaultFilter);
    const [userList, setUserList] = useState({
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
            getAllUsers({ ...filters });
        }, 500);
        return () => clearTimeout(timer);
    }, [filters]);

    const getAllUsers = async (filters) => {
        await userService.getAllUsers(filters).then((res) => {
            if (res) {
                setUserList(res);
            }
        });
    };

    const columns = [
        { id: "firstName", label: "First Name", minWidth: 100 },
        { id: "lastName", label: "Last Name", minWidth: 100 },
        {
            id: "email",
            label: "Email",
            minWidth: 170,
        },
        {
            id: "roleName",
            label: "Role",
            minWidth: 130,
        },
    ];

    const onConfirmDelete = async () => {
        await userService.deleteUser(selectedId)
            .then((res) => {
                if (res) {
                    toast.success(Shared.messages.DELETE_SUCCESS);
                    setOpen(false);
                    setFilters({ ...filters });
                }
            })
            .catch((e) => toast.error(Shared.messages.DELETE_FAIL));
    };

    return (
        <div className={classes.root}>
               <Paper className={classes.paper}>
               <Typography variant="h4">Users</Typography><hr/>
                    <TextField
                        style={{ float:"right" ,width:'400px',marginRight:'0.3cm'}}

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
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {userList?.items?.map((row, index) => (
                                <TableRow key={`${index}-${row.id}-${row.email}`}>
                                    <TableCell></TableCell>
                                    <TableCell>{row.firstName}</TableCell>
                                    <TableCell>{row.lastName}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.role}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => {
                                                navigate(`/edit-user/${row.id}`);
                                            }}
                                            style={{ marginRight: "8px" }}
                                        >
                                            Edit
                                        </Button>
                                        {row.id !== authContext.user.id && (
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => {
                                                    setOpen(true);
                                                    setSelectedId(row.id ?? 0);
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!userList?.items?.length && (
                                <TableRow className="TableRow">
                                    <TableCell colSpan={5} className="TableCell">
                                        <Typography align="center" className="noDataText">
                                            No Users
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={RecordsPerPage}
                    component="div"
                    count={userList?.totalItems || 0}
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
                    title="Delete user"
                    description={Shared.messages.USER_DELETE}
                />
            </Paper>
        </div>
    );
};

export default User;
