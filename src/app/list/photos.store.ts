import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/component-store';
import { pipe } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { Photo } from '../photo.model';
import { FlickrAPIResponse, PhotoService } from '../photo.service';
import { signalStore, withState, withMethods, patchState, withHooks, signalStoreFeature } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

const PHOTO_STATE_KEY = 'photo_search';

export interface PhotoState {
  photos: Photo[];
  search: string;
  page: number;
  pages: number;
  loading: boolean;
  error: unknown;
}

const initialState: PhotoState = {
  photos: [],
  search: '',
  page: 1,
  pages: 1,
  loading: false,
  error: '',
};

// probably best to move pagination out of signalStore ?
export const PhotoStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, photoService = inject(PhotoService)) => ({
    updateSearch(search) {  // the passing of `$event` causes problems typing search 
      patchState(store, { search });
    },
    updatePage() {
      patchState(store, { page: store.page() + 1 });
      // console.log('page next', store.page()); // page goes up but another api request is not triggered
      // this.loadSearch(store.search()); // just call load search again -> doesn't work -> distinctUntilChanged problem?
      // I duplicated loadSearch method and slightly altered it into new method `newPageSearch`.
      this.newPageSearch(store.page());
    },
    previousPage() {
      patchState(store, { page: store.page() - 1 });
      this.newPageSearch(store.page());
    },
    loadSearch: rxMethod<string>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, { loading: true, page: localStorage.getItem('page') !== null ? Number(localStorage.getItem('page')) : 1 })),
        switchMap(() => // (search, page)
          photoService.searchPublicPhotos(store.search(), store.page()).pipe(
            tapResponse({
              next: (res: FlickrAPIResponse) => patchState(store, { photos: res.photos.photo, page: res.photos.page, pages: res.photos.pages }),
              error: console.error,
              finalize: () => {
                localStorage.setItem(PHOTO_STATE_KEY, JSON.stringify({ search: store.search(), page: store.page() }))
                patchState(store, { loading: false })
              },
            }),
          ),
        ),
      ),
    ),
    newPageSearch: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap(() =>
          photoService.searchPublicPhotos(store.search(), store.page()).pipe(
            tapResponse({
              next: (res: FlickrAPIResponse) => patchState(store, { photos: res.photos.photo, page: res.photos.page, pages: res.photos.pages }),
              error: console.error,
              finalize: () => {
                localStorage.setItem(PHOTO_STATE_KEY, JSON.stringify({ search: store.search(), page: store.page() }))
                patchState(store, { loading: false });
              }
            }),
          ),
        ),
      ),
    ),
  })),
  withHooks({
    onInit({ loadSearch, search }) {
      loadSearch(search);
    }
  }),
  localStorageSync()
);

/*
  withHooks({
    ...,
    onDestroy(){
      localStorage.clear();
    }
  })

  // When you navigate to the detail page, the component store is destroyed.  Using local storage can preserve the state.
  // You can't clear the local storage at any point.  A user would have to clear the local storage afterwards leaving the app. 
*/


function localStorageSync() {
  // even with this, you aren't guaranteed the exact order of images
  // the batch size is 30 images so the first and last pictures are more likely to change pages
  // total page count seems to change frequently 
  // if you add onDestroy is in this feature -> local storage won't work

  return signalStoreFeature(
    withHooks({
      onInit(store) {
        const storage = localStorage.getItem(PHOTO_STATE_KEY);

        if (storage) {
          const { search, page } = JSON.parse(storage);

          // originally stored pages as well but 
          // pages is quite volatile 
          // I don't require the pages value for any logic so I removed pages from the local storage object

          // don't need to be explicit 
          // patchState(store, {search: search, page: page});

          patchState(store, { search, page });
        }
      }
    })
  )
}
