import {
  catchError,
  debounceTime,
  delay,
  filter,
  map,
  mapTo,
  pluck,
  switchMap,
  withLatestFrom
} from "rxjs/operators";
import {
  SEARCH,
  fetchFulfilled,
  setStatus,
  fetchFailed,
  CANCEL,
  reset,
  RANDOM
} from "../reducers/beersActions";
import { ofType } from "redux-observable";
import { concat, fromEvent, of, merge, race, forkJoin } from "rxjs";

const search = (apiBase, perPage, term) =>
  `${apiBase}?beer_name=${encodeURIComponent(term)}&per_page=${perPage}`;
const random = (apiBase) => `${apiBase}/random`;

export function fetchBeersEpic(action$, state$, { getJSON }) {
  return action$.pipe(
    // ofType(SEARCH),
    ofType(RANDOM),
    // debounceTime(500),
    // filter(({ payload }) => payload.trim()),
    withLatestFrom(state$.pipe(pluck("config"))),
    switchMap(([{ payload }, config]) => {
      console.log("config", config);
      const requests = [...Array(config.perPage)].map(() => {
        return getJSON(random(config.apiBase)).pipe(pluck(0));
      });
      // const ajax$ = getJSON(search(config.apiBase, config.perPage, payload))
      //   .pipe(
      //     delay(5000),
      //     map((resp) => fetchFulfilled(resp)),
      //     catchError((err) => {
      //       return of(fetchFailed(err.response.message));
      //     })
      //   );

      const ajax$ = forkJoin(requests).pipe(
        map((resp) => fetchFulfilled(resp)),
        catchError((err) => {
          return of(fetchFailed(err.response.message));
        })
      );

      const blocker$ = merge(
        action$.pipe(ofType(CANCEL)),
        fromEvent(document, "keyup").pipe(
          filter((event) => event.key === "Escape" || event.key === "Esc")
        )
      ).pipe(mapTo(reset()));

      return concat(of(setStatus("pending")), race(ajax$, blocker$));
    })
  );
}
