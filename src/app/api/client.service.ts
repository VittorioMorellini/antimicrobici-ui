import { Injectable, Optional } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";

import { Observable, Observer, Subject, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { ApiConfig, mkUrl } from "./api-config";
import { behead, untail } from "../commons/commons";
import { AuthService } from "../auth/auth.service";
import { LockoutService } from "../auth/lockout.service";

export interface HttpOptions {
  responseType?: any;
  headers?: HttpHeaders;
  params?: HttpParams;
}

export interface WsClient<T> {
  ws: WebSocket;
  subject: Subject<T>;
}

function mkWsClient(ws: WebSocket): WsClient<any> {
  // instances the observable of this websocket
  // new websocket? new observable!
  const observable = new Observable((obs: Observer<any>) => {
    // binds observer methods to observer and sets the resulting functions
    // as the websocket callbacks used to delivering of messages, errors and
    // closing the socket.
    ws.onmessage = obs.next.bind(obs);
    ws.onerror = obs.error.bind(obs);
    ws.onclose = obs.complete.bind(obs);
    // returns the function to clean up the websocket (just close)
    return ws.close.bind(ws);
  });

  // whenever subject next is used, a new message is sent back to the server
  const observer = {
    next: (data: any) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      }
    },
  };

  // FIXME
  const subject = Subject.create(observer, observable);
  const client: WsClient<any> = { ws, subject };

  return client;
}

/**
 * A client that performs athenticated requests and exchanges JSON data.
 */
@Injectable()
export class ApiClientService {
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfig,
    @Optional() private authService: AuthService,
    @Optional() public lockout: LockoutService
  ) { }

  /**
   * Sets the JSON content type.
   *
   * @param headers The headers
   */
  private static addJsonHeader(headers: HttpHeaders): HttpHeaders {
    return headers.set("Content-Type", "application/json");
  }

  /**
   * Creates a WebSocket.
   *
   * @param path  The path relative to ApiConfig.rootPath
   * @return A promise with the instanced WS client.
   */
  ws(path: string): Promise<WsClient<any>> {
    const s = window.location.protocol === "https:" ? "wss" : "ws";
    const h = window.location.hostname;
    const p = window.location.port ? ":" + window.location.port : "";

    return new Promise((resolve, reject) => {
      const url = `${s}://${h}${p}/${this.makeAuthUrl(
        mkUrl(this.apiConfig, path)
      )}`;
      let ws;
      try {
        ws = new WebSocket(url);
      } catch (e) {
        console.error(`Cannot instance WebSocket to ${url}`, e);
        reject(e);
      }
      ws.onopen = () => resolve(mkWsClient(ws));
      ws.onerror = (err) => reject(err);
    });
  }

  /**
   * Performs an HTTP GET call.
   *
   * @param path    The path relative to ApiConfig.rootPath
   * @param options Optional HTTP parameters
   * @return An Observable of the outcome
   */
  get<T>(path: string, options: HttpOptions = {}): Observable<T> {
    const url = mkUrl(this.apiConfig, path);
    const opts = this.makeOptions(options);

    return this.http.get<T>(url, opts).pipe(catchError(this.onAuthError(this)));
  }

  /**
   * Performs an HTTP POST call.
   *
   * @param  path    The path relative to ApiConfig.rootPath
   * @param  body    Any value that will be converted to a JSON string and
   *                 sent as the HTTP message body. Optional, if nothing is
   *                 specified then no body is sent at all.
   * @return An Observable of the outcome
   */
  post<T>(path: string, body?: any): Observable<T> {
    const url = mkUrl(this.apiConfig, path);
    const opts = this.makeOptions({}, true);
    const msg = body
      ? typeof body === "string"
        ? body
        : JSON.stringify(body)
      : undefined;

    return this.http
      .post<T>(url, msg, opts)
      .pipe(catchError(this.onAuthError(this)));
  }

  put<T>(path: string, body?: any): Observable<T> {
    const url = mkUrl(this.apiConfig, path);
    const opts = this.makeOptions({}, true);
    const msg = body
      ? typeof body === "string"
        ? body
        : JSON.stringify(body)
      : undefined;

    return this.http
      .put<T>(url, msg, opts)
      .pipe(catchError(this.onAuthError(this)));
  }

  delete<T>(path: string): Observable<T> {
    const url = mkUrl(this.apiConfig, path);
    const opts = this.makeOptions({}, true);

    return this.http
      .delete<T>(url, opts)
      .pipe(catchError(this.onAuthError(this)));
  }

  /**
   * Enriches the given URL with proper root and authentication token.
   *
   * @param path A URL with (optionally) some parameters set.
   * @return Complete url (with proper root and authentication token)
   */
  makeAuthUrl(path: string): string {
    const rootUrl = untail(this.apiConfig.rootPath, "/");
    const relUrl = behead(path, "/");
    let url = rootUrl + "/" + relUrl;
    if (this.authService) {
      const paramJoiner = path.indexOf("?") < 0 ? "?" : "&";
      url += paramJoiner + "token=" + this.authService.token;
    }
    return url;
  }

  private makeOptions(options: HttpOptions = {}, hasBody = false): HttpOptions {
    const opts = {
      headers: options.headers || new HttpHeaders(),
      params: options.params || new HttpParams(),
      responseType: options.responseType,
      withCredentials: true,
    };
    opts.headers = this.addAuthHeader(opts.headers);
    if (hasBody) {
      opts.headers = ApiClientService.addJsonHeader(opts.headers);
    }
    return opts;
  }

  /**
   * Sets the authentication token
   *
   * @param headers The headers
   */
  private addAuthHeader(headers: HttpHeaders): HttpHeaders {
    if (this.authService) {
      const t = this.authService.token;
      return t ? headers.set("Authorization", "Bearer " + t) : headers;
    }
    return headers;
  }

  /*
   * Manages the authentication issues due to an attempt to call a remote service
   * from an unauthorized (not logged in) or forbbiden (not authorized) user.
   *
   * @param self This service
   * @return The callback function to be invoked when errors occur
   */
  public onAuthError(
    self: ApiClientService
  ): (err: any, caught: Observable<any>) => Observable<never> {
    return (res: HttpErrorResponse) => {
      // 401: unauthorized (read not authenticated)
      if (res.status === 401) {
        // if not authenticated
        console.error(
          `⛔  Unauthenticated request to ${res.url}, locking user out!`
        );
        if (self.lockout) {
          self.lockout.lockout();
          // self.lockout.block(res.error && res.error.message);
        }
      }

      // 403: forbidden (read not authorized to do that operation)
      if (res.status === 403) {
        console.error(
          `⛔  Unauthorized request to ${res.url}, locking user out!`
        );
        if (self.lockout) {
          self.lockout.block(res.error && res.error.message);
        }
      }

      return throwError(res);
    };
  }
}
