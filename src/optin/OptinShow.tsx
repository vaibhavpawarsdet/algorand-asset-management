import { Grid, Button, Divider, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Box, Typography, StepContent, Step, Stepper, Paper, StepLabel } from '@mui/material';
import React, { useMemo } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TopToolbar, EditButton, Create, SimpleForm, TextInput, Show, Toolbar, useNotify, } from 'react-admin';
import { Post } from '../utils/apiCalls';
import { apiURL } from '../dataProvider/rest';
import { redirect } from 'react-router';

// Actions
const AssetShowActions = (props: any) => {
    const permission = JSON.parse(sessionStorage.getItem('menuData') as unknown as string)['Assets'].find((res) => res.id === 2)['permission']
    const { basePath, data } = props;
    return (
        <TopToolbar>
            {permission && permission === 1 ? <EditButton record={data} /> : null}
        </TopToolbar>
    );
};

let permission = JSON.parse(sessionStorage.getItem('menuData') as unknown as string)
let profile = JSON.parse(sessionStorage.getItem('profile') as string)


const OptinShow = (props: any) => {
    const notify = useNotify();
    const [activeStep, setActiveStep] = React.useState(0);

    useMemo(() => {
        permission = JSON.parse(sessionStorage.getItem('menuData') as unknown as string)
        profile = JSON.parse(sessionStorage.getItem('profile') as string)
    }, [sessionStorage.getItem('menuData'), sessionStorage.getItem('profile')])
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const CustomToolbar = (props: any) => (
        <Toolbar {...props} style={{ justifyContent: 'space-between' }} >
            <Button variant="contained" color="primary" href="#/assets" startIcon={<ArrowBackIcon />}>
                Back
            </Button>
            <Button variant="contained" color="primary" onClick={handleClickOpen} >
                Transfer Asset
            </Button>
        </Toolbar>
    );
    //
    return (
        <Show {...props} >
            <SimpleForm {...props} actions={<AssetShowActions />} toolbar={<CustomToolbar />} >
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <TextInput
                                    source="asset_name"
                                    resource="assets"
                                    fullWidth
                                    disabled={true}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextInput
                                    source="unit_name"
                                    resource="assets"
                                    fullWidth
                                    disabled={true}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextInput
                                    source="asset_id"
                                    resource="assets"
                                    fullWidth
                                    disabled={true}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextInput
                                    source="block_id"
                                    resource="assets"
                                    fullWidth
                                    disabled={true}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={2}>
                                <TextInput
                                    type="total_supply"
                                    source="total_supply"
                                    resource="assets"
                                    fullWidth
                                    disabled={true}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextInput
                                    source="asset_url"
                                    resource="assets"
                                    fullWidth
                                    disabled={true}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextInput
                                    source="manager_address"
                                    resource="assets"
                                    fullWidth
                                    disabled={true}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextInput
                                    source="reserve_address"
                                    resource="assets"
                                    fullWidth
                                    disabled={true}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextInput
                                    source="freeze_address"
                                    resource="assets"
                                    fullWidth
                                    disabled={true}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextInput
                                    source="clawback_address"
                                    resource="assets"
                                    fullWidth
                                    disabled={true}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </SimpleForm >
        </Show >
    )
}

export default OptinShow;