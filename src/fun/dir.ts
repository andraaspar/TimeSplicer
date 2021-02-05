import { log } from "./log";

export function dir(o: any) {
  log(o);
  for (var key in o) {
    log("→", key, "=", o[key]);
  }
}
