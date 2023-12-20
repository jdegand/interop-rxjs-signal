# Interop RxJs Signal

[Angular Challenges](https://angular-challenges.vercel.app/) #30 Interoperability Rxjs/Signal Alternative Solution using [NgRx Signal Store](https://ngrx.io/guide/signals/signal-store).

## Thoughts

- Since NgRx signals store has been officially released, I decided to try it out.  Quite frankly, it is a little overwhelming.  Since everything hinges on the one method, you can't easily debug and piecemeal a solution.  There is limited feedback.
- I started my conversion by following the [NgRx docs](https://ngrx.io/guide/signals/rxjs-integration).
- To make further progress, I had to remove some functionality such as the disabling of the nextPage button and the use of Local Storage.  I also had to remove some Typescript restrictions.  I removed the input and gave an initial value to `search` to ensure an API request would happen. 
- The API request was executed, but I couldn't see it in the template.  With signals, I think sub-components seem necessary.  You can't have a form and render the response data in the same component with signals? 
- I was able to see the photos in the app, but the input still didn't work.  I needed to add a change handler and bind that to the `Output` in `search-box.component.ts`.
- This [Angular Challenge PR](https://github.com/tomalaforge/angular-challenges/pull/88/files#diff-65b58fb82cf0bb15310b512c401850474771eb1c399793906f1d47eb7f61847c) was a critical resource in troubleshooting this app.  Looking at the PR, Marko segmented the code much better than I have done.  I kept the initial state object versus breaking state into multiple pieces.
- Now, I can see why.  I don't think you can get access to `$update` when add a store and a service to `withMethods`.  
- For the pagination, I can update the page value but this doesn't cause another api request to happen.  If the input doesn't change, the API request will not be triggered.  
- The `loadSearch` method uses `distinctUntilChanged`.  This might prevent the `loadSearch` method from being called again as `search` has not changed.  
- Ultimately, the quickest solution was to duplicate `loadSearch` and call the new method `newPageSearch` inside the `nextPage` and `prevPage` methods.  Inside the new method, I removed the `distinctUntilChanged` and the `debounceTime` calls.  So there is a slight benefit from using a new method.  

## Continued Development

- Pagination implementation is kind of a mess.  I tried to explain a lot of the tradeoffs and problems I encountered.  
- When you click back on the detail page, it resets the input and queries new photos.  This might be related to the lack of Local Storage.    
- Testing -> I'd imagine this will be difficult.  

## Useful Resources

- [NgRx Docs](https://ngrx.io/guide/signals/rxjs-integration) - rxjs integration
- [Angular Training](https://www.angulartraining.com/daily-newsletter/three-ways-to-update-angular-signals/) - 3 ways to update Angular Signals
- [Github](https://github.com/ngrx/platform/discussions/3796) - (Closed) RFC: NgRx SignalStore
- [Angular Addicts](https://www.angularaddicts.com/p/from-ngrx-componentstore-to-signalstore) - ngrx component store to signal store
- [Dev.to](https://dev.to/this-is-angular/handling-pagination-with-ngrx-component-stores-1j1p#handling-the-pagination) - handling pagination with ngrx component stores