/*
// The flickr api may have changed since the challenge was created
// or it was intentionally slimmed down
export interface Photo {
    id: string;
    title: string;
    tags: string;
    owner: string;
    ownername: string;
    datetaken: string;
    url_q: string;
    url_m: string;
}
*/

export interface Photo {
    id: string
    owner: string
    secret: string
    server: string
    farm: number
    title: string
    ispublic: number
    isfriend: number
    isfamily: number
    datetaken: string
    datetakengranularity: number
    datetakenunknown: any
    ownername: string
    tags: string
    url_q: string
    height_q: number
    width_q: number
    url_m: string
    height_m: number
    width_m: number
}