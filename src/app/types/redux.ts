export type Agregation = {
    id: string,
    title: string;
    url: string;
    keywords: string[];
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface AgregationsState  {
    agregations: Agregation[];
}