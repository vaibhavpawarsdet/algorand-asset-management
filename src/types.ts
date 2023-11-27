// import { Identifier, RaRecord, ReduxState } from 'ra-core';
import { RaRecord, Identifier } from 'react-admin';
// import { ReduxState } from 'react-admin';

export type ThemeName = 'light' | 'dark';

// export interface AppState extends ReduxState {
//     theme: ThemeName;
// }

export interface Category extends RaRecord {
    name: string;
}

export interface Product extends RaRecord {
    category_id: Identifier;
    description: string;
    height: number;
    image: string;
    price: number;
    reference: string;
    stock: number;
    thumbnail: string;
    width: number;
}

export interface Customer extends RaRecord {
    first_name: string;
    last_name: string;
    address: string;
    city: string;
    zipcode: string;
    avatar: string;
    birthday: string;
    first_seen: string;
    last_seen: string;
    has_ordered: boolean;
    latest_purchase: string;
    has_newsletter: boolean;
    groups: string[];
    nb_commands: number;
    total_spent: number;
}

export interface Company extends RaRecord {
    company_name: string;
    company_phone: number;
    country:string;
}

export interface Country extends RaRecord {
    country: string;
    
}

export interface Branch extends RaRecord {
    name: string;
    
}

export interface Transport_order extends RaRecord {
    po_number: string;
    container_number:string;
    shipment_status: number;
}

export interface Tracking extends RaRecord {
    bl_number: string;
    shipment_status: number;
}

export interface Purchase_order extends RaRecord {
    exporter_id: string;
    
}

export interface Insurance extends RaRecord {
    seal_number: number;
    
}

export interface Documents extends RaRecord {
    file_name: string;
    po_code:string;
    table_name:string;
    id:number;
}

export interface Containers extends RaRecord {
    container_number: string;
    seal_number:string;
}

export interface Shipping_items extends RaRecord {
    container_number: string;
    bl_number: string   
}

export interface Contact extends RaRecord {
    first_name: string;
    last_name: string;
    
}

export interface Invites extends RaRecord {
   to_email_address:string;
    
}

export interface Roles extends RaRecord {
    role_id:number;
     
 }

 export interface Users extends RaRecord {
    email_id: string
    email:string;

 }

 export interface Po_orders extends RaRecord {
    created_by:string;
    updated_by:string;
    po_code:string;

 }

export interface Order extends RaRecord {
    basket: BasketItem[];
}
export interface Country extends RaRecord {
    country_id: string;
    country: string;
}
export interface BasketItem {
    product_id: string;
    quantity: number;
}

/**
 * Types to eventually add in react-admin
 */
export interface FieldProps<T extends RaRecord = RaRecord> {
    addLabel?: boolean;
    label?: string;
    record?: T;
    source?: string;
}

// export interface Review extends RaRecord {
//     customer_id: string;
// }

// type FilterClassKey = 'button' | 'form';

// export interface FilterProps<Params = {}> {
//     classes?: ClassNameMap<FilterClassKey>;
//     context?: 'form' | 'button';
//     displayedFilters?: { [K in keyof Params]?: boolean };
//     filterValues?: Params;
//     hideFilter?: ReturnType<typeof useListController>['hideFilter'];
//     setFilters?: ReturnType<typeof useListController>['setFilters'];
//     showFilter?: ReturnType<typeof useListController>['showFilter'];
//     resource?: string;
// }

// export interface ReferenceFieldProps<T extends RaRecord = RaRecord>
//     extends FieldProps<T> {
//     reference: string;
//     children: ReactChildren;
//     link?: string | false;
//     sortBy?: string;
// }

export interface ProformaInvoice extends RaRecord {
    unique_marks_no: any;
    product_code: number;
    exporter_id: number;
    buyer_id: number;
    status:number;
    invoice_number: string;
    products:string[];
    taxes:string[];
    id: number
}

export interface GenericTemplate extends RaRecord {
    template_name: any;
    tab_title: number;
    tab_section: number;
    id: number
}

export interface CommercialInvoice extends RaRecord {
    product_code: number;
    exporter_id: number;
    buyer_id: number;
    buyer: number;
    status:number;
    invoice_number: string;
    products:string[];
    taxes:string[];
}

export interface PurchaseOrderform extends RaRecord {
    product_code: number;
    exporter_id: number;
    buyer_id: number;
    status:number;
    invoice_number: string;
    products:string[];
    taxes:string[];
}

export interface PackingList extends RaRecord {
    product_code: number;
    exporter_id: number;
    buyer_id: number;
    buyer: number;
    status:number;
    invoice_number: string;
    products:string[];
    products_line:string[];
    taxes:string[];
}

export interface GenericInvoice extends RaRecord {
    id: number;
    exporter_id: number;
    buyer_id: number;
    status:number;
    invoice_number: string;
}

export interface SurveyInvoice extends RaRecord {
    product_code: number;
    exporter_id: number;
    buyer_id: number;
    buyer: number;
    status:number;
    invoice_number: string;
    products:string[];
    products_line:string[];
    taxes:string[];
}

export interface CustomInvoice extends RaRecord {
    exporter_id: number;
    buyer_id: number;
    packed_by: number;
    invoice_number: string;
    products:string[];
}

export interface AmcInvoice extends RaRecord {
    exporter_id: number;
    buyer_id: number;
    packed_by: number;
    invoice_number: string;
    products:string[];
}

export interface EiaInvoice extends RaRecord {
    exporter_id: number;
    buyer_id: number;
    packed_by: number;
    invoice_number: string;
    products:string[];
}

export interface CertificateOrigin extends RaRecord {
    products: [];
    
}


export interface Notification extends RaRecord {
    invoice_number: string;
    receiver_email: string;
    invoice_doc: string;
    record_id: Number;
    created_date: string;
    comments: string;
    table_name: string;
}

export interface Payment extends RaRecord {
    payment_date: string;
    payment: string;
    reference: string;
    payment_mode: Number;
    amount_received: string;
    customer_name:string,
    notes:string,
    payment_bank : string
}

export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type Operator = '+' | '-' | '×' | '÷'