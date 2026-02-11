export interface IPaginationShared {
    limit: number;
    afterCursor?: string | null;
    beforeCursor?: string | null;
    filters?: FiltersShare[]

}

export interface FiltersShare {
    field: string
    operator?: 'equals' | 'contains' | 'in' | 'gt' | 'lt';
    Value: any
}