import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Photo } from './photo.model';
import { environment } from '../environments/environment.development';

export interface FlickrAPIResponse {
    photos: {
        page: number
        pages: number
        perpage: number
        total: number
        photo: Photo[]
    }
    stat: string
}

@Injectable({ providedIn: 'root' })
export class PhotoService {
    private http = inject(HttpClient);

    public searchPublicPhotos(
        searchTerm: string,
        page: number
    ): Observable<FlickrAPIResponse> {

        return this.http.get<FlickrAPIResponse>(
            'https://www.flickr.com/services/rest/',
            {
                params: {
                    tags: searchTerm,
                    method: 'flickr.photos.search',
                    format: 'json',
                    nojsoncallback: '1', // true?
                    tag_mode: 'all',
                    media: 'photos',
                    per_page: '30',
                    page,
                    extras: 'tags,date_taken,owner_name,url_q,url_m',
                    api_key: environment.apiKey,
                },
            }
        );
    }
}