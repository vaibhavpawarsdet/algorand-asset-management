import { Badge, ListItem, Divider, Typography, ListItemIcon, SvgIcon, Drawer, ListItemText, IconButton, MenuItem, MenuList, ListItemButton, List } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import React, { forwardRef, Fragment, useEffect, useState } from 'react';
import { AppBar, MenuItemLink, useDataProvider, useRedirect, UserMenu, useTranslate, Logout, useNotify, useUserMenu } from 'react-admin';
import { Link } from 'react-router-dom';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Notification } from '../types';
import Logo from './Logo';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { apiURL } from '../dataProvider/rest';
import { createTheme } from '@mui/material/styles';
import { Get, GetAll } from '../utils/apiCalls';

const theme = createTheme();
const client = new W3CWebSocket('wss://socket.fdpconnect.com');

// const client = new W3CWebSocket('ws://127.0.0.7:8000');

//Styles
const useStyles = makeStyles(() =>
  createStyles({
    title: {
      flex: 1,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
    spacer: {
      flex: 1,
    },
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      position: 'relative',
      overflow: 'auto',
    },

    inline: {
      display: 'inline',
    },
    ResponNotifi: {
      width: '50%',
      top: '20%',
      height: '80%',
      [theme.breakpoints.up('md')]: {
        width: '100%',
        top: '20%',
      },
    },
    drawerPaper: {
      zIndex: 100,
      width: '25%',
      top: '6%',
      right: '0',
    },
    card: {
      content: "",
      width: 0,
      height: 0,
      display: 'block',
      position: 'absolute',
      zIndex: 10,
      border: '0',
      borderLeft: '10px solid red',
      borderRight: '10px solid red',
      marginLeft: '-10px',
      left: '50%',
      borderBottom: '10px solid #587b7f',
      top: '-10px',
    }
  }),
);

// Menu of Profile in App Bar
const ConfigurationMenu = forwardRef<any, any>((props, ref) => {
  const translate = useTranslate();
  const { onClose } = useUserMenu();
  return (
    <MenuList>
      <MenuItem component={Link}
        // @ts-ignore
        ref={ref}
        {...props}
        to={`/profile/${sessionStorage.getItem('companyid')}`}
        onClick={onClose}
      >
        <ListItemIcon>
          <AccountCircleIcon />
        </ListItemIcon>
        <ListItemText>{translate('pos.profile')}</ListItemText>
      </MenuItem>

      {props.acctype === 'Admin' ? <MenuItem
        component={Link}
        // @ts-ignore
        ref={ref}
        tabIndex={1}
        to={`/module/getTemplateSection/${sessionStorage.getItem('userid')}`}
        onClick={onClose}
      >
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText>{translate('pos.dynamic_menu')}</ListItemText>
      </MenuItem> : null}
    </MenuList>
  );
});

// Profile Data Get Call
const CustomUserMenu = (props: any) => {
  const [value, setValue] = useState({ first_name: '', account_type: '' });
  const redirect = useRedirect();

  useEffect(() => {
    if ('token' in sessionStorage) {
      const getProfile = async () => {
        const response = await Get(apiURL + `/profile/`, sessionStorage.getItem('companyid') as unknown as string)
        if (response && response.data) {
          sessionStorage.setItem('profile', JSON.stringify(response.data))
          setValue({ first_name: response.data.first_name, account_type: response.data.account_type })
        }
        else {
          redirect('/login');
        }
      }
      getProfile()
    }
  }, [sessionStorage.getItem('companyid')]);

  return (
    <Fragment>
      <div> <span> {sessionStorage.getItem('firstname') == null ? value.first_name : sessionStorage.getItem('firstname')}
        ({sessionStorage.getItem('acctype') == null ? value.account_type : sessionStorage.getItem('acctype')}) </span></div>
      <UserMenu label={sessionStorage.getItem('firstname') == null ? value.first_name : sessionStorage.getItem('firstname')}  {...props}>
        <ConfigurationMenu acctype={sessionStorage.getItem('acctype') == null ? value.account_type : sessionStorage.getItem('acctype')} />
        <Logout />
        {/* <Settings /> */}
      </UserMenu>
    </Fragment>
  );
};

export let countryData: any = [];
export let incotermsData: any = [];
export let currencyData: any = [];

// Main Function
const CustomAppBar = (props: any) => {
  const classes = useStyles();
  const redirect = useRedirect();
  const notify = useNotify();
  const [state, setState] = useState(false);
  const [temp, settemp] = useState(false);
  const [notifi, setnotifi]: any = useState('');

  // Open menu profile
  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    } setState(open);
  };
  client.onmessage = (message) => {
    if (message.data === sessionStorage.getItem("userEmail"))
      settemp(!temp)
  }
  useEffect(() => {
    if (sessionStorage.getItem('token')) {
      const getNotifi = async () => {
        const response = await GetAll(apiURL + `/graphs/notifications`)
        if (response && response.data) {
          setnotifi(response.data)
        }
        else {
          redirect('/login');
        }
      }
      getNotifi()
    }
  }, [temp])

  useEffect(() => {
    if (sessionStorage.getItem('token')) {
      const GetData = async () => {
        const responseCountry = await GetAll(apiURL + `/country`)
        if (responseCountry && responseCountry.data) {
          countryData = [...responseCountry.data];
        }
        else {
          redirect('/login');
          countryData = [];
        }

        const responseCurrency = await GetAll(apiURL + `/currencycodes`)
        if (responseCurrency && responseCurrency.data) {
          currencyData = [...responseCurrency.data];
        }
        else {
          redirect('/login');
          currencyData = [];
        }

        const responseInco = await GetAll(apiURL + `/inco_terms`)
        if (responseInco && responseInco.data) {
          incotermsData = [...responseInco.data];
        }
        else {
          redirect('/login');
          incotermsData = [];
        }
      }
      GetData()
    }
  }, [])

  const nb = notifi ? notifi.reduce((nb: number) => ++nb, 0) : 0;

  // Notification List 
  const list = () => (
    <>
      <div
        role="notification"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <List>
          {notifi ? notifi.map((record: Notification) => [record] && (record.created_date = String(new Date(record.created_date).toString().split('GMT')[0]))
            && (
              <>
                <ListItemButton to={`link`} component={Link} key={record.id} sx={{ display: 'block' }}
                >
                  <ListItem>
                    <ListItemIcon style={{ width: '2em', height: '2em' }}>
                      {/* <SvgIcon style={{ width: '2em', height: '1.5em' }}>
                      {record.path ? record.path.map((d: any) => <path d={d} />) : []}
                    </SvgIcon> */}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <Typography
                            variant="h6"
                            color="textPrimary"
                            sx={{ textTransform: 'capitalize', display: 'inline', wordWrap: 'break-word' }}
                          >
                            {record.notification_type}
                          </Typography>
                        </React.Fragment>
                      }
                      secondary={
                        <>
                          <Typography
                            variant="body2"
                            style={{ display: 'inline', wordWrap: 'break-word' }}
                            color="textPrimary"
                          >
                            Sent By: {record.sent_by}</Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <Typography
                      variant="body2"
                      style={{ display: 'inline', wordWrap: 'break-word' }}
                      color="textPrimary"
                    >
                      {record.created_date} - {record.comments ? record.comments : "No Comments"}
                    </Typography>
                  </ListItem>
                </ListItemButton>
                <Divider />
              </>
            ))
            : null}
        </List>

      </div>
      {notifi ? notifi === "" ? <Typography style={{ padding: '0 31%', color: '#757575' }}>No New Notification</Typography> : null : <Typography style={{ padding: '0 31%', color: '#757575' }}>No New Notification</Typography>}
    </>
  );
  return (
    <div>
      <AppBar {...props} userMenu={<CustomUserMenu />}>
        <Typography
          variant="h6"
          color="inherit"
          className={classes.title}
          id="react-admin-title"
        />
        <Logo />
        <span className={classes.spacer} />

        <IconButton color="inherit" aria-haspopup="true" aria-label="notificaton"
          onClick={toggleDrawer(true)}>
          <Badge badgeContent={nb} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

      </AppBar>

      <Drawer variant="temporary" anchor="right" open={state} onClose={toggleDrawer(false)} classes={{ paper: classes.drawerPaper }}>
        <IconButton size="medium" style={{ color: '#283593', backgroundColor: '#ffff', float: 'right' }} color="inherit" onClick={toggleDrawer(false)} aria-label="close"><CloseIcon style={{ paddingLeft: '10%' }} />
        </IconButton>
        {list()}

      </Drawer>

    </div>
  );
};

export default CustomAppBar;
