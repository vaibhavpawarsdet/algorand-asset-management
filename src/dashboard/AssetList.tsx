import React, { Fragment, useCallback, useMemo } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssetIcon from '@mui/icons-material/Business';
import { List, Datagrid, TextField, Link, useListContext, useRecordContext, useListController, TabbedShowLayout, Show, SimpleShowLayout, ReferenceManyField, Button, Toolbar, TopToolbar, CreateButton, Count, Filter, SearchInput, TextInput } from 'react-admin';
import { Tabs, Tab } from '@mui/material';


const ShowLink = (props: any) => {
  const record = useRecordContext();
  const { resource } = useListContext();
  if (!record) return null
  return <Link to={`/${resource}/${record.id}/show`} style={{ display: 'flex', justifyContent: 'center' }}>
    <VisibilityIcon />
  </Link>
};

let permission = JSON.parse(sessionStorage.getItem('menuData') as unknown as string)
let profile = JSON.parse(sessionStorage.getItem('profile') as string)

const AssetList = (props: any) => {
  const listContext = useListContext();
  const { filterValues, setFilters, displayedFilters } = listContext;

  const handleChange = useCallback(
    (event: React.ChangeEvent<{}>, value: any) => {
      setFilters &&
        setFilters(
          { status: value },
          displayedFilters,
          false // no debounce, we want the filter to fire immediately
        );
    },
    [displayedFilters, setFilters]
  );
  const RowStyle = (record: any, index: any) => ({
    backgroundColor: index % 2 === 0 ? 'white' : 'rgba(0,0,0,.05)',
  });

  useMemo(() => {
    permission = JSON.parse(sessionStorage.getItem('menuData') as unknown as string)
    profile = JSON.parse(sessionStorage.getItem('profile') as string)
  }, [sessionStorage.getItem('menuData'), sessionStorage.getItem('profile')])
  const tabs = [
    { id: 'assets', name: 'assets' },
    { id: 'optin', name: 'optin' },
  ];
  return (
    <div>

      <List {...props} >
        {/* <Tabs
          variant="fullWidth"
          centered
          // value={filterValues.status}
          indicatorColor="primary"
          onChange={handleChange}
        >
          {tabs.map(choice => (
            <Tab
              key={choice.id}
              label={
                <span>
                  {choice.name} (
                  <Count
                    sx={{ lineHeight: 'inherit' }}
                  />
                  )
                </span>
              }
              value={choice.id}
            />
          ))}
        </Tabs> */}
        <Datagrid sx={{
          '& .column-undefined': { textAlign: 'center' },
          '& .column-company_name': {
            whiteSpace: 'normal',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }
        }}>
          <TextField source="asset_name" label="Asset Name" />
          <TextField source="asset_id" label="Asset Id" />
          {/* <TextField source="asset_total" label="Asset Total" /> */}
          <TextField source="manager" label="Manager Address" />
          <TextField source="transaction" label="Transaction Id" />
          {/* <TextField source="reserve_addr" label="Reserve Address" />
        <TextField source="freeze_addr" label="Freeze Address" />
        <TextField source="clawback_addr" label="Clawback Address" /> */}
          <ShowLink label="VIEW" sortable={false} />
        </Datagrid>
      </List>
    </div>
  )
}

export default AssetList;