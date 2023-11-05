export type Agregation = {
    id: string,
    title: string;
    url: string;
    baseUrl: string;
    selector: string;
    keywords: string[];
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface AgregationsState  {
    agregations: Agregation[];
}