import { log } from "./log";

export function reportError(e: any, msg: string = "") {
  const finalMessage = e && msg ? `${msg}\n${e.message}` : e || msg;
  log(finalMessage);
  alert(finalMessage, "Error");
}
