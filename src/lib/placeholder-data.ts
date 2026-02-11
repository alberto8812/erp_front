export type Invoice = {
    id: string;
    customer_id: string;
    amount: number;
    date: string;
    // In TypeScript, this is called a string union type.
    // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
    status: 'pending' | 'paid';
};
const invoices: Invoice[] = [
    {
        id: 'inv_001',
        customer_id: 'cus_001',
        amount: 2500,
        status: 'paid',
        date: '2022-01-15',
    },
    {
        id: 'inv_002',
        customer_id: 'cus_002',
        amount: 4500,
        status: 'pending',
        date: '2022-12-06',
    },
    {
        id: 'inv_003',
        customer_id: 'cus_003',
        amount: 20348,
        status: 'pending',
        date: '2022-11-14',
    },
    // ...
];