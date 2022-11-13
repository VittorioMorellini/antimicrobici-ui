import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";

import { Observable } from "rxjs";

import { NamedEntity, Result } from "../api/dto";
import { StampeService } from "../api/stampe.service";

@Injectable({
  providedIn: "root",
})
export class StampeResolverService implements Resolve<string> {
  constructor(private readonly client: StampeService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<string> {
    const urlMenu = route.routeConfig.path;
    return this.client.find(urlMenu);
  }
}
