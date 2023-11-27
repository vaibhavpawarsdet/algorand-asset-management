import './App.css';
import { Admin, ListGuesser, Resource } from 'react-admin';
import Login from './login/Login';
import authProvider from './authProvider';
import { useState, useEffect } from 'react';
import dataProviderFactory from './dataProvider';
import assets from './dashboard';
import jsonServerProvider from 'ra-data-json-server';
import { UserList } from './users/UserList';
import UserShow from './users/UserShow';
import simpleRestProvider from 'ra-data-simple-rest';
import process from 'process';
import OptinList from './optin/OptinList';
import OptinShow from './optin/OptinShow';
//import profile from './profile';

//const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");
function App() {
  const [dataProvider, setDataProvider]: any = useState(null);

  useEffect(() => {
    let restoreFetch;

    const fetchDataProvider = async () => {
      const dataProviderInstance = await dataProviderFactory(
        process.env.REACT_APP_DATA_PROVIDER
      )
      setDataProvider(
        () => dataProviderInstance
      );
    };

    fetchDataProvider();

    return restoreFetch;
  }, []);

  if (!dataProvider) {
    return (
      <div className="loader-container">
        <div className="loader">Loading...</div>
      </div>
    );
  }
  let permission = JSON.parse(sessionStorage.getItem('menuData') as unknown as string)
  let profile = JSON.parse(sessionStorage.getItem('profile') as string)

  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      loginPage={Login}
    >
      {/* {profile['exporter_type'].includes("1" || "0") ? */}
      <Resource name='assets'
        {...assets}
      />
      {/* : null} */}
      <Resource name='optin'
        list={OptinList}
        show={OptinShow}
      />

      {/* <Resource name='users'
        list={UserList} */}
      {/* // show={UserShow}
      /> */}
    </Admin>
  );
}

export default App;
