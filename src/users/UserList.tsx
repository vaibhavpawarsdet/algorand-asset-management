import { List, Datagrid, TextField, EmailField, Create, SimpleForm, Link, useListContext, useRecordContext, useListController, TabbedShowLayout } from "react-admin";
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssetIcon from '@mui/icons-material/Business';

const ShowLink = (props: any) => {
    const record = useRecordContext();
    const { resource } = useListContext();
    if (!record) return null
    return <Link to={`/${resource}/${record.id}/show`} style={{ display: 'flex', justifyContent: 'center' }}>
        <VisibilityIcon />
    </Link>
};

const AssetLinkField = (props: any) => {
    const record = useRecordContext();
    if (!record) return null;
    return <Link to={`/users/${record.id}/`}>
        <AssetIcon />
    </Link>
};
export const UserList = (props: any) => {

    const { data } = useListController(props);

    return (
        <List {...props}>
            <TabbedShowLayout >
                <TabbedShowLayout.Tab label="Asset View" path='users'>
                    <Datagrid rowClick="edit">
                        <TextField source="id" />
                        <TextField source="name" />
                        <TextField source="username" />
                        <EmailField source="email" />
                        <TextField source="address.street" />
                        <TextField source="phone" />
                        <TextField source="website" />
                        <TextField source="company.name" />
                        <ShowLink label="VIEW" sortable={false} />
                        {data ? data[0].users ? <AssetLinkField label="USERS" /> : null : null}
                    </Datagrid>
                </TabbedShowLayout.Tab>
            </TabbedShowLayout>
        </List>
    )
};

// export const UserCreate = (props: any) => (
//     <Create {...props}>
//         <SimpleForm >
//             <TextField source="id" />
//             <TextField source="name" />
//             <TextField source="username" />
//             <EmailField source="email" />
//             <TextField source="address.street" />
//             <TextField source="phone" />
//             <TextField source="website" />
//             <TextField source="company.name" />
//         </SimpleForm>
//     </Create>
// );
