type Comment ={
    id: number,
    content: string,
    created_at: string,
    biosample_id: number
}

export type CreateSampleType ={
    date: string,
    locations: string,
    operators: string,
    types: string,
}

export interface BiosampleTypes extends CreateSampleType {
    id: number,
    comments: Array<Comment>,
}

export interface stateType  {
    locations : Array<string>,
    types : Array<string>,
    operators : Array<string>,
}

export type FilterKey = "locations" | "types" | "operators";