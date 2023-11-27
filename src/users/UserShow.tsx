import React from 'react';
import { Show, SimpleShowLayout, TextField, EmailField, RichTextField } from 'react-admin';

const UserShow = (props: any) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id"/>
            <TextField source="name" />
            <TextField source="username" />
            <EmailField source="email" />
            <TextField source="address.street" />
            <TextField source="phone" />
            <TextField source="website" />
            <TextField source="company.name" />
        </SimpleShowLayout>
    </Show>
);

export default UserShow;
