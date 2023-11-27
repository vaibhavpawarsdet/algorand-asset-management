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


const AssetShow = (props: any) => {
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
    const handleTransferAsset = async () => {
        const responseBody = {
            asset_id: 'asset_id',
            receiver_addr: 'receiver_addr',
            amount: 'amount'
        }
        const response = await Post(`${apiURL}/assets/transfer`, responseBody);

        if (response?.data && response.data.Status) {
            const responseData = await response.data;
            notify('Transfer Asset successfully');
            handleClose();
        } else {
            notify('Error creating asset', { type: 'error' });
        }
    }

    const steps = [
        {
            asset_id: `Asset Id: 483609662`,
            block_id: `Block Id: 34833471`,
            from_address: 'From Address: E7KX5QWVSMMGF4I6YWZOWONPFYP4F7WF63YCNDBWFXJJ2EBBRHQY',
            to_address: 'To Address: null',
            transaction: 'Transaction : TC6BHIEPQHKLUCUGZAAO4BBHUGQPDX6I42CECJI3ZS3M7XKTVTSA',
            amount: 'Amount: 1',
        },
    ];
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
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };
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

                    <Grid item xs={6}>
                        <Box sx={{ maxWidth: 400 }}>
                            <Stepper activeStep={activeStep} orientation="vertical">
                                {steps.map((step, index) => (
                                    <Step key={step.asset_id}>
                                        <StepLabel
                                            optional={
                                                index === 2 ? (
                                                    <Typography variant="caption">Last step</Typography>
                                                ) : null
                                            }
                                        >
                                            {step.asset_id}
                                        </StepLabel>
                                        <StepContent>
                                            <Typography>{step.block_id}</Typography>
                                            <Typography>{step.from_address}</Typography>
                                            <Typography>{step.to_address}</Typography>
                                            <Typography>{step.transaction}</Typography>
                                            <Typography>{step.amount}</Typography>
                                            <Box sx={{ mb: 2 }}>
                                                <div>
                                                    <Button
                                                        variant="contained"
                                                        onClick={handleNext}
                                                        sx={{ mt: 1, mr: 1 }}
                                                    >
                                                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
                                                    </Button>
                                                    <Button
                                                        disabled={index === 0}
                                                        onClick={handleBack}
                                                        sx={{ mt: 1, mr: 1 }}
                                                    >
                                                        Back
                                                    </Button>
                                                </div>
                                            </Box>
                                        </StepContent>
                                    </Step>
                                ))}
                            </Stepper>
                            {activeStep === steps.length && (
                                <Paper square elevation={0} sx={{ p: 3 }}>
                                    <Typography>All steps completed - you&apos;re finished</Typography>
                                    <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                                        Reset
                                    </Button>
                                </Paper>
                            )}
                        </Box>
                    </Grid></Grid>
            </SimpleForm >
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Transfer Asset</DialogTitle>
                <DialogContent>
                    <TextField
                        id='asset_id'
                        label="Asset Id"
                    />
                    <TextField
                        autoFocus
                        id="receiver_addr"
                        label="Receiver Address"
                    />
                    <TextField
                        autoFocus
                        id="amount"
                        label="Amount"
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleTransferAsset}>Transfer Asset</Button>
                </DialogActions>
            </Dialog>
        </Show >
    )
}

export default AssetShow