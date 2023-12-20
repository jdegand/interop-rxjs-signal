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
          class="text-xl border rounded-md p-3"
          (click)="store.updatePage()">
          >
        </button>
        Page :{{ store.page() }} / {{ store.pages() }}
      </section>

      @if(store.loading()){
        <mat-progress-bar
        mode="query"
        class="mt-5"></mat-progress-bar>
      }

      @if(store.photos() && store.photos().length > 0){
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
        } @empty {
        <div>No Photos found. Type a search word.</div>
      }
      </ul>
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

/*
import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLinkWithHref } from '@angular/router';
import { Photo } from '../photo.model';
import { PhotoStore } from './photos.store';
import { SearchBoxComponent } from "../search-box.component";
import { STATE_SIGNAL } from '@ngrx/signals/src/state-signal';

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
          class="text-xl border rounded-md p-3"
          (click)="store.nextPage()">
          >
        </button>
        Page :{{ store.page() }} / {{ store.pages() }}
      </section>
      @if(store.loading()){
        <mat-progress-bar
        mode="query"
        class="mt-5"></mat-progress-bar>
      }
      <ul
        class="flex flex-wrap gap-4"
        *ngIf="store.photos() && store.photos().length > 0; else noPhoto">
        <li *ngFor="let photo of store.photos(); trackBy: trackById">
          <a routerLink="detail" [queryParams]="{ photo: encode(photo) }">
            <img
              src="{{ photo.url_q }}"
              alt="{{ photo.title }}"
              class="image" />
          </a>
        </li>
      </ul>
      <ng-template #noPhoto>
        <div>No Photos found. Type a search word.</div>
      </ng-template>
      <footer *ngIf="store.error()" class="text-red-500">
        {{ store.error() }}
      </footer>
    </section>
  `,
  providers: [PhotoStore],
  host: { class: 'p-5 block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatProgressBarModule,
    NgIf,
    NgFor,
    RouterLinkWithHref,
    SearchBoxComponent
  ]
})
export default class PhotosComponent {
  readonly store = inject(PhotoStore);

  trackById(_: number, photo: Photo): string {
    return photo.id;
  }

  encode(photo: Photo): string {
    return encodeURIComponent(JSON.stringify(photo));
  }
}
*/
