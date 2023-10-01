export const columns = [
    {key: 'id', type: 'int', label: 'ID'},
    {key: 'issuerName', type: 'string', label: 'Issuer'},
    {key: 'dealName', type: 'string', label: 'Deal'},
    {key: 'bloombergId', type: 'string', label: 'Bloomberg ID'},
    {key: 'total', type: 'decimal', label: 'Total'},
    {key: 'industry', type: 'string', label: 'Industry'},
    {key: 'status', type: 'string', label: 'Status'},
    {key: 'analysts', type: 'string[]', label: 'Analysts'},
    {key: 'docCount', type: 'int', label: 'Docs'},
    {key: 'customDealIdentifiers', type: 'string[]', label: 'Identifiers'}
];