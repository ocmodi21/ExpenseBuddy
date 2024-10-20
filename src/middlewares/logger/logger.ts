import morgan from "morgan";
import fs from "fs";
import {
  greenBright,
  bold,
  yellowBright,
  redBright,
  magentaBright,
  underline,
  cyan,
  whiteBright,
} from "colorette";

function method(tokens: any, req: any, res: any) {
  return String(tokens.method(req, res));
}

function status(tokens: any, req: any, res: any) {
  return String(tokens.status(req, res));
}

function url(tokens: any, req: any, res: any) {
  return String(tokens.url(req, res));
}

function resTime(tokens: any, req: any, res: any) {
  return tokens["response-time"](req, res) + " ms";
}

function getDate(tokens: any, req: any, res: any) {
  return String(tokens.date(req, res));
}

function beautifyMessage(message: string) {
  const msgComponents = message.split(" ");

  let method = msgComponents[0];
  if (method == "GET") method = greenBright(bold(method));
  else if (method == "POST") method = yellowBright(bold(method));
  else if (method == "PATCH") method = magentaBright(bold(method));
  else if (method == "DELETE") method = redBright(bold(method));

  let status = msgComponents[1];
  if (status[0] == "1" || status[0] == "3")
    status = whiteBright(underline(bold(status)));
  else if (status[0] == "2") status = greenBright(underline(bold(status)));
  else if (status[0] == "4") status = redBright(underline(bold(status)));
  else if (status[0] == "5") status = redBright(underline(bold(status)));

  let url = msgComponents[2];

  let resTime = cyan(msgComponents[3] + " " + msgComponents[4]);

  let date =
    msgComponents[5] +
    " " +
    msgComponents[6] +
    " " +
    msgComponents[7] +
    " " +
    msgComponents[8] +
    " " +
    msgComponents[9] +
    " " +
    msgComponents[10];
  return [method, status, url, resTime, date].join(" ");
}

export const logger = morgan(function (tokens, req, res) {
  let logMessage = [
    method(tokens, req, res),
    status(tokens, req, res),
    url(tokens, req, res),
    resTime(tokens, req, res),
    getDate(tokens, req, res),
  ].join(" ");

  fs.writeFile(
    __dirname + "/serverLogs",
    logMessage + "\r\n",
    { flag: "a+" },
    (e) => {
      if (e) console.log(e);
    }
  );
  return beautifyMessage(logMessage);
});

export default logger;
