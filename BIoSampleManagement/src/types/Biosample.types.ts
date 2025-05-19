export type BiosampleTypes = {
    id: number,
    date: string,
    location: string,
    operator: string,
    type: string,
    comments: Array<comment>,
}

type comment ={
    id: number,
    content: string,
    biosample_id: number
}

export type createSampleType ={
    date: string,
    location: string,
    operator: string,
    type: string,
}

