export type BiosampleTypes = {
    id: number,
    date: string,
    locations: string,
    operators: string,
    types: string,
    comments: Array<Comment>,
}

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

