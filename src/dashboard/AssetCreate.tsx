import React, { useState, useEffect, useCallback } from 'react'
import { makeStyles } from '@mui/styles';
import { AutocompleteInput, Create, email, FormDataConsumer, SaveButton, minLength, minValue, number, ReferenceInput, regex, required, SimpleForm, TextInput, maxLength, Toolbar, maxValue, useCreate, useDataProvider, useNotify, useRedirect, CreateButton, Form, NumberInput } from 'react-admin';
import { Button, Divider, Grid, Switch, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { apiURL } from '../dataProvider/rest';
import { Post } from '../utils/apiCalls';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { transform } from '../utils/TransformData';
//import useFor

const useStyles = makeStyles(() => ({
    divider: {
        width: '100%',
        marginBottom: '1em'
    },
}))


const AssetCreate = (props: any) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const classes = useStyles();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [assetUrl, setAssetUrl] = useState('');
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const [managerAddr, setManagerAddr] = useState('');
    const [reserveAddr, setReserveAddr] = useState('');
    const [freezeAddr, setFreezeAddr] = useState('');
    const [clawbackAddr, setClawbackAddr] = useState('');


    // Remove Undefind before senting
    const transformData = (data) => ({
        ...transform(data),
        "asset_url": assetUrl,
        "manager_addr": managerAddr,
        "reserve_addr": reserveAddr,
        "freeze_addr": freezeAddr,
        "clawback_addr": clawbackAddr,
    });


    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const selectedFile = files[0];

            const maxSizeInBytes = 3 * 1024 * 1024; // 3MB
            if (selectedFile.size > maxSizeInBytes) {
                notify('Image size exceeds the allowed limit (3MB)', Error);
            } else {
                setSelectedImage(selectedFile);
            }
        }
    };

    const handleImageUpload = async () => {
        if (selectedImage) {
            try {
                const reader = new FileReader();
                reader.readAsDataURL(selectedImage);
                reader.onloadend = async () => {
                    const base64Image = reader.result?.toString().split(";base64,")[1];
                    const filename = selectedImage.name;
                    // Construct the JSON object with the base64 image data
                    const requestBody = {
                        imageName: "flash_image",
                        filename: filename,
                        imageDescription: "The is uploaded from postman",
                        mime_type: "image/png",
                        filedata: base64Image,
                    };
                    const response = await Post(`https://testapi.fdpconnect.com/ipfsFileUpload`, requestBody);
                    //  console.log(response);
                    if (response?.status === 200 && response.data && response.data.Status) {
                        const responseData = await response.data;
                        console.log(responseData);

                        let ipnftToken = responseData.data.ipnft;
                        // localStorage.setItem('assetUrl', ipnftToken);
                        // console.log(localStorage.setItem('assetUrl', ipnftToken));

                        // form.change("asset_url", ipnftToken);
                        setAssetUrl(`ipfs://${ipnftToken}/#arc3`);
                        notify('Image upload successfully', Error);
                    }
                };
            } catch (error) {
                console.error('Error reading image as base64:', Error);
            }
        }
    }

    // const handleSwitchChange = () => {

    // };
    const handleAlgorandRegister = async () => {
        setIsSwitchOn(!isSwitchOn);
        if (!isSwitchOn) {
            try {
                const response = await Post(`${apiURL}/algoAccount/register`, {});

                if (response?.status === 200) {
                    const responseData = await response.data;
                    // notify('Asset created successfully', `{Success}`);
                    console.log(responseData);
                    console.log(responseData.data[0].address);

                    // Update the state with the received data
                    setManagerAddr(responseData.data[0].address || '');
                    setReserveAddr(responseData.data[0].address || '');
                    setFreezeAddr(responseData.data[0].address || '');
                    setClawbackAddr(responseData.data[0].address || '');
                    // redirect('/assets/create');
                } else {
                    notify('Error creating asset', Error);
                }
            } catch (error) {
                console.error('Error creating asset:', Error);
                notify('Error creating asset', Error);
            }
        }
    }

    // Bottom Toolbar 
    const CustomToolbar = (props: any) => (
        <Toolbar {...props} className="ToolbarEditCreate" >
            {/* <Button href="#/branches" variant="contained" color="primary" startIcon={<ArrowBackIcon />}>Back</Button>
       */}
            <SaveButton {...props} type='submit' variant="contained" color="primary" label="Create Assest" />
        </Toolbar>
    );

    // const onSuccess = (data) => {
    //     console.log(data)
    //     if (data.Status) {
    //         notify(`${data.asset_name}  Created Successfully`);
    //         redirect('/assets')
    //     } else {
    //         notify(`${data.message}`, { type: 'error' });
    //     }
    // }

    const handleSave = useCallback(
        async (values) => {
            const transformedValues = transform(values);
            const data = {
                asset_name: 'asset_name',
                unit_name: "unit_name",
                asset_decimal: "asset_decimal",
                asset_total: "asset_total",
                ...transformedValues, "asset_url": assetUrl,
                "manager_addr": managerAddr,
                "reserve_addr": reserveAddr,
                "freeze_addr": freezeAddr,
                "clawback_addr": clawbackAddr,
            }

            const response = await Post(apiURL + `/assets/`, { ...data })
            if (response && response.data && response.data.Status) {
                notify(`${response.data.asset_name}  Created Successfully`);
                redirect('/assets')
            } else {
                notify(`${response?.data?.message}`, { type: 'error' });
            }
        }, [assetUrl, managerAddr, reserveAddr, freezeAddr, clawbackAddr]
    )
    // onSubmit={handleCreateAsset}
    const label = { inputProps: { 'aria-label': 'Switch demo' } };
    return (
        <div>
            <Create {...props} label="Create Asset">
                <SimpleForm title={'Create Asset'} toolbar={<CustomToolbar />} onSubmit={handleSave}>
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            <TextInput
                                source="asset_name"
                                resource="assets"
                                label="Asset Name"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextInput
                                source="unit_name"
                                resource="assets"
                                label="Unit Name"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <NumberInput
                                source="asset_decimal"
                                resource="assets"
                                label="Asset Decimal"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                                Upload Image
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange}
                                />
                            </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleImageUpload}
                            >
                                Submit Image
                            </Button>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={5}>
                            <NumberInput
                                source="asset_total"
                                resource="assets"
                                label="Total Asset"
                                fullWidth
                            />
                        </Grid>
                        {/* <Grid item xs={4}>
                            <TextInput
                                id="address"
                                resource="assets"
                                label="Wallet Address"
                                fullWidth
                            />
                        </Grid> */}
                        <Grid item xs={7}>
                            <TextField
                                key={Math.random()}
                                id="asset_url"
                                label="Asset URL"
                                resource="assets"
                                value={assetUrl}
                                fullWidth
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={1}>
                            <Switch {...label}
                                checked={isSwitchOn}
                                onChange={handleAlgorandRegister}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <TextField
                                id="manager_addr"
                                resource="assets"
                                label="Manager Address"
                                fullWidth
                                value={managerAddr}
                                onChange={(e) => setManagerAddr(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="reserve_addr"
                                resource="assets"
                                label="Reserve Address"
                                fullWidth
                                value={reserveAddr}
                                onChange={(e) => setReserveAddr(e.target.value)}
                            />
                        </Grid>
                    </Grid>

                    <Divider variant="fullWidth" className={classes.divider} />

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                id="freeze_addr"
                                resource="assets"
                                label="Freeze Address"
                                fullWidth
                                value={freezeAddr}
                                onChange={(e) => setFreezeAddr(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="clawback_addr"
                                resource="assets"
                                label="Clawback Address"
                                fullWidth
                                value={clawbackAddr}
                                onChange={(e) => setClawbackAddr(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </SimpleForm >
            </Create >
        </div>
    )
};

export default AssetCreate;