import React, { useState } from 'react'
import { useLogin, useNotify, useRedirect, Form, required, PasswordInput, TextInput, email, useTranslate, } from 'react-admin';
import { useLocation } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import MuiDialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, Grid, IconButton, Slide, Typography, Button, Card, CardActions, CircularProgress, TextField, Autocomplete } from '@mui/material';
import PropTypes from 'prop-types';
import { apiURL } from '../dataProvider/rest';
import { TransitionProps } from '@mui/material/transitions';

const useStyles = makeStyles(() => ({
    main: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'flex-start',
        // background: 'url(/background_images/file_' + rnd + ".jpg)",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        fontFamily: 'Montserrat, sans-serif'
    },
    card: {
        minWidth: 300,
        marginTop: '6em',
    },
    card1: {
        minWidth: 300,
        overflow: 'auto !important'
        // marginTop: '3em',
    },
    hint: {
        marginTop: '1em',
        display: 'flex',
        justifyContent: 'center',
        // color: theme.palette.grey[500],
        color: '#9e9e9e'
    },
    form: {
        padding: '0 1em 1em 1em',
    },
    input: {
        marginTop: '1em',
    },
}));

interface FormValues {
    username?: string;
    password?: string;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const Exporter_type = [
    { id: "0", name: "Exporter(Merchant)" },
    { id: "1", name: "Exporter(Manufacturer)" },
    { id: '2', name: "Importer" },
    { id: '3', name: "Exporter & Importer" },
    { id: "4", name: "OceanLiner" },
    { id: "5", name: "Shipper" },
    // { id:"6", name:"FreightForwarder" },
    { id: "9", name: "Insurance" },
    { id: "10", name: "FreightForwarder/CHA" },
    { id: "7", name: "Others" },
]

const Login = (props: any) => {
    const [loading, setLoading] = useState(false);
    const translate = useTranslate();
    const classes = useStyles();
    const redirect = useRedirect();
    const { state }: any = useLocation();
    const notify = useNotify();
    const login = useLogin();
    const [openRegister, setOpenRegister] = React.useState(false);
    const [register, setRegister]: any = React.useState({});
    const [error, setError] = React.useState({ err: {} });

    // Validate Email
    const validateEmail = (email: any) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    // Validate Register
    const validateRegister = (values: any) => {
        const errors: any = {};
        const list = { ...error }

        if (!values.email_id && Object.keys(values).find((d: any) => d === 'email_id')) {
            errors.email_id = translate('ra.validation.required');
        }
        else if (!validateEmail(values.email_id) && Object.keys(values).find((d: any) => d === 'email_id')) {
            errors.email_id = 'Please Enter Valid Email Address';
        }
        if (!values.password && Object.keys(values).find((d: any) => d === 'password')) {
            errors.password = translate('ra.validation.required');
        }

        else if (values.password?.length < 8 && Object.keys(values).find((d: any) => d === 'password')) {
            errors.password = 'Password is too short';
        }
        else if (!values.confirm_password && Object.keys(values).find((d: any) => d === 'confirm_password')) {
            errors.confirm_password = translate('ra.validation.required');
        }
        else if (values.password !== values.confirm_password) {
            errors.confirm_password = translate('pos.confirm_password')
        }

        if (!values.company_type && Object.keys(values).find((d: any) => d === 'company_type')) {
            errors.company_type = translate('ra.validation.required');
        }

        list.err = errors
        setError(list)
        if (Object.entries(errors).length === 0)
            return 0
        else
            return -1
    };

    const { onClose, ...other } = props;

    // Update Register          
    const handleChangeRegister = (event: any, NewValue: any) => {
        const list = { ...register };
        const { value } = event.target;
        var id = event.target.id.split('-option')[0];

        if (id === 'role') {
            list[id] = NewValue.id
        }
        else {
            list[id] = value
        }
        validateRegister(list)
        setRegister(list)
    };

    // Submit Register Values
    const handleSubmitRegister = (auth: any) => {
        // const apiURL = "xyz.com";
        if (validateRegister(auth) === 0) {
            setLoading(true);
            const request = new Request(apiURL + '/login/register', {
                method: 'POST',
                body: JSON.stringify(auth),
                headers: new Headers({ 'Content-Type': 'application/json' }),
            });

            fetch(request)
                .then(response => {
                    setLoading(false);
                    setOpenRegister(false);
                    if (response.status < 200 || response.status >= 300) {
                        return response.json().then((value: any) => {
                            throw new Error(value.message);
                        })
                    }
                    response.json().then((value: any) => {
                        notify(value.message)
                        handleCloseRegister()
                    })

                }).catch(
                    (error: Error) => {
                        setLoading(false);
                        notify(
                            typeof error === 'string'
                                ? error
                                : typeof error === 'undefined' || !error.message
                                    ? 'unexpected error occured'
                                    : error.message,
                            { type: 'warning' }
                        );
                    }
                );
        }
        else {
            notify('The form is not valid. Please check for errors', { type: 'warning' })
        }
    };

    // Open Register Form
    const handleClickOpenRegister = (e: any) => {
        setOpenRegister(true);
        e.preventDefault();
    };

    // Close Register Form
    const handleCloseRegister = () => {
        setRegister({})
        setOpenRegister(false);
    };

    const handleLogin = (auth: FormValues) => {
        setLoading(true);

        login(auth, state?.path || '/assets').then(() => {
            if (sessionStorage.getItem('firsttime_user') === '0'
                && sessionStorage.getItem('token')) {
                redirect('/first_user/create')
            }
        }).catch((error: Error) => {
            setLoading(false);
            notify(
                typeof error === 'string' ? error : typeof error === 'undefined' || !error.message
                    ? 'ra.auth.sign_in_error'
                    : error.message,
                { type: 'warning' }
            );
        });
    };

    return (
        <div>
            <Form {...props} onSubmit={handleLogin} noValidate >
                <div className={classes.main}>
                    <Card className={classes.card}>
                        <div className={classes.hint}>
                            Please Login
                        </div>
                        <div className={classes.form}>
                            <div className={classes.input}>
                                <TextInput
                                    autoFocus
                                    source="username"
                                    variant='standard'
                                    fullWidth
                                    label={"Email Address"}
                                    validate={[required(), email("Please Enter Valid Email Address")]}
                                    disabled={loading}
                                />
                            </div>
                            <div className={classes.input}>
                                <PasswordInput
                                    source="password"
                                    variant='standard'
                                    fullWidth
                                    label={"Password"}
                                    validate={required()}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div style={{ padding: '0 1em 0 1em' }}>

                            <Button
                                variant="contained"
                                type="submit"
                                color="primary"
                                disabled={loading}
                                fullWidth
                            >
                                {loading && (
                                    <CircularProgress
                                        size={25}
                                        thickness={2}
                                    />
                                )}
                                {translate('ra.auth.sign_in')}
                            </Button>
                        </div>
                        {/* <div style={{ padding: '0 1em 0 1em' }}>
                            <p style={{ marginTop: '0' }}>
                                <Button color="primary" onClick={handleClickOpenRegister} >
                                    <u style={{ color: '#3f51b5' }}>
                                        Crate an account
                                    </u>
                                </Button>
                            </p>
                    </div> */}
                    </Card>
                </div>
            </Form>

            <Dialog fullWidth maxWidth="md" keepMounted open={openRegister} disableEscapeKeyDown
                aria-labelledby="alert-dialog-slide-title" onClose={(event, reason) => { if (reason !== 'backdropClick') { handleCloseRegister } }}
                TransitionComponent={Transition} aria-describedby="alert-dialog-slide-description" >
                <MuiDialogTitle className="appBarSend"  {...other}>
                    <IconButton size="medium" className="closeButtonSend" color="inherit" onClick={handleCloseRegister} aria-label="close"><CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className="sendTypo"><b>Registration Form</b></Typography>
                </MuiDialogTitle>

                <Card className={classes.card1}>

                    <div className={classes.form}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <div className={classes.input} style={{ maxHeight: '30%', minHeight: '30%' }}>
                                    <TextField
                                        autoFocus
                                        id="company_name"
                                        variant='standard'
                                        fullWidth
                                        label={"COMPANY NAME*"}
                                        disabled={loading}
                                        value={register.company_name}
                                        helperText={error.err['company_name']} error={!error.err['company_name'] ? false : true}
                                        onChange={(e: any) => handleChangeRegister(e, '')}
                                    />
                                </div>

                                <div className={classes.input}>

                                    <Autocomplete id="company_type" disableClearable fullWidth autoSelect onChange={(event: any, newValue: any) => handleChangeRegister(event, newValue)}
                                        options={Exporter_type} getOptionLabel={(option: any) => option.name}
                                        renderInput={(params: any) => (<TextField {...params} id="company_type" label="COMPANY TYPE*" fullWidth variant='standard' error={error.err['company_type'] ? true : false} helperText={error.err['company_type']} />)} />
                                </div>

                                <div className={classes.input}>
                                    <TextField
                                        id="mobile_number"
                                        variant='standard'
                                        fullWidth
                                        label={"MOBILE NUMBER"}
                                        onChange={(e: any) => handleChangeRegister(e, '')}
                                        disabled={loading}
                                        value={register.mobile_number}
                                        helperText={error.err['mobile_number']} error={!error.err['mobile_number'] ? false : true}
                                    />
                                </div>

                            </Grid>
                            <Grid item xs={6}>

                                <div className={classes.input} style={{ maxHeight: '30%', minHeight: '30%' }}>
                                    <TextField
                                        id="iec_code"
                                        variant='standard'
                                        fullWidth
                                        label={"IEC NUMBER*"}
                                        onChange={(e: any) => handleChangeRegister(e, '')}
                                        disabled={loading}
                                        value={register.iec_code}
                                        helperText={error.err['iec_code']} error={!error.err['iec_code'] ? false : true}
                                    />
                                </div>
                                <div className={classes.input}>
                                    <TextField
                                        id="email_id"
                                        type="email"
                                        variant='standard'
                                        fullWidth
                                        label={"EMAIL ADDRESS*"}
                                        onChange={(e: any) => handleChangeRegister(e, '')}
                                        disabled={loading}
                                        value={register.email_id}
                                        helperText={error.err['email_id']} error={!error.err['email_id'] ? false : true}
                                    />
                                </div>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <div className={classes.input}>
                                    <TextField
                                        id="password"
                                        variant='standard'
                                        fullWidth
                                        label={"PASSWORD*"}
                                        type="password"
                                        onChange={(e: any) => handleChangeRegister(e, '')}
                                        disabled={loading}
                                        value={register.password}
                                        helperText={error.err['password'] ? error.err['password'] : "Use 8 or more characters with a mix of letters, numbers & symbols"} error={!error.err['password'] ? false : true}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <div className={classes.input}>
                                    <TextField
                                        id="confirm_password"
                                        variant='standard'
                                        fullWidth
                                        label={"CONFIRM PASSWORD*"}
                                        type="password"
                                        onChange={(e: any) => handleChangeRegister(e, '')}
                                        disabled={loading}
                                        value={register.confirm_password}
                                        helperText={error.err['confirm_password']} error={!error.err['confirm_password'] ? false : true}
                                    />
                                </div>
                            </Grid></Grid>
                    </div>

                    <CardActions className="ToolbarEditCreate">
                        <Button variant="contained" onClick={handleCloseRegister} color="primary" >
                            Cancel
                        </Button>

                        <Button variant="contained" color="primary" disabled={loading} onClick={() => handleSubmitRegister(register)}>
                            {loading && (<CircularProgress size={25} thickness={2} />)} Register </Button>
                    </CardActions>
                </Card>
            </Dialog>
        </div>
    );
}
Login.propTypes = {
    authProvider: PropTypes.func,
    previousRoute: PropTypes.string,
};
export default Login;