import { Datagrid, Link, List, TextField, useListContext, useRecordContext } from 'react-admin';
import VisibilityIcon from '@mui/icons-material/Visibility';


const OptinList = (props: any) => {

    const ShowLink = (props: any) => {
        const record = useRecordContext();
        const { resource } = useListContext();
        if (!record) return null
        return <Link to={`/${resource}/${record.id}/show`} style={{ display: 'flex', justifyContent: 'center' }}>
            <VisibilityIcon />
        </Link>
    };
    return (
        <List {...props} >
            <Datagrid>
                <TextField source="asset_id" label="Asset Id" />
                <TextField source="transaction" label="Transaction Id" />
                <ShowLink label="VIEW" sortable={false} />
            </Datagrid>
        </List>
    );
};

export default OptinList;