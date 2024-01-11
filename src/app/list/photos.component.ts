import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLinkWithHref } from '@angular/router';
import { Photo } from '../photo.model';
import { PhotoStore } from './photos.store';
import { SearchBoxComponent } from "../search-box.component";

@Component({
  selector: 'app-photos',
  standalone: true,
  template: `
    <h2 class="text-xl mb-2">Photos</h2>

    <app-search-box [query]="store.search()" (search)="store.updateSearch($event)"></app-search-box>

    <section class="flex flex-col">
      <section class="flex gap-3 items-center">
        <button
          [disabled]="store.page() === 1"
          [class.bg-gray-400]="store.page() === 1"
          class="text-xl border rounded-md p-3"
          (click)="store.previousPage()">
          <
        </button>
        <button
          [disabled]="store.page() === store.pages()"
          [class.bg-gray-400]="store.page() === store.pages()"
          class="text-xl border rounded-md p-3"
          (click)="store.updatePage()">
          >
        </button>
        @if(store.photos().length > 0){
          <div>Page : {{ store.page() }} / {{ store.pages() }}</div>
        }
      </section>

      @if(store.loading()){
        <mat-progress-bar
        mode="query"
        class="mt-5"></mat-progress-bar>
      }

      @if(store.photos().length > 0){
        <ul class="flex flex-wrap gap-4">
        @for(photo of store.photos(); track photo.id){
          <li>
          <a routerLink="detail" [queryParams]="{ photo: encode(photo) }">
            <img
              src="{{ photo.url_q }}"
              alt="{{ photo.title }}"
              class="image" />
          </a>
        </li>
        }
      </ul>
      } @else {
        <div>No Photos found. Type a search word.</div>
      }

      @if(store.error()){
        <footer class="text-red-500">
        {{ store.error() }}
        </footer>
      }
    </section>
  `,
  providers: [PhotoStore],
  host: { class: 'p-5 block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatProgressBarModule,
    RouterLinkWithHref,
    SearchBoxComponent
  ]
})
export default class PhotosComponent {
  readonly store = inject(PhotoStore);

  encode(photo: Photo): string {
    return encodeURIComponent(JSON.stringify(photo));
  }
}
