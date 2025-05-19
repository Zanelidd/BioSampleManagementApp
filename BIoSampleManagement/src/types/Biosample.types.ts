export type BiosampleTypes = {
    id: number,
    date: string,
    location: string,
    operator: string,
    type: string,
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
    location: string,
    operator: string,
    type: string,
}

