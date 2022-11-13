import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { ApiClientService } from "./client.service";
import { mkHttpParams } from "./utils";

@Injectable()
export class StampeService {
  constructor(private readonly client: ApiClientService) {}

  /**
   * Finds the records `Stampe` according to optional filter.
   * @param filter The filter.
   */
  find(urlMenu?: string): Observable<string> {
    const params: HttpParams = mkHttpParams(urlMenu);
    const opts = params ? { params } : {};
    return this.client.get<string>("stampe", opts);
  }
}
