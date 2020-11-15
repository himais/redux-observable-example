import { ofType } from "redux-observable";
import { SET_CONFIG, setConfig } from "../reducers/configActions";
import { ignoreElements, pluck, tap, withLatestFrom } from "rxjs/operators";
import { EMPTY, of } from "rxjs";

const CACHE_KEY = "rx-config";

export function persistEpic(action$, state$) {
  return action$.pipe(
    ofType(SET_CONFIG),
    withLatestFrom(state$.pipe(pluck("config"))),
    tap(([_, config]) => {
      localStorage.setItem(CACHE_KEY, JSON.stringify(config));
    }),
    ignoreElements()
  );
}

export function hydrateEpic() {
  const config = localStorage.getItem(CACHE_KEY);

  if (typeof config === "string") {
    try {
      const parsed = JSON.parse(config);
      return of(setConfig(parsed));
    } catch (_) {
      return EMPTY;
    }
  }
  return EMPTY;
}
