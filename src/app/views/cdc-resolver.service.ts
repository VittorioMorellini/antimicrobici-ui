import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { NamedEntity, Result, CentroDiCosto } from '../api/dto';
import { CdcService } from '../api/cdc.service';

@Injectable({
  providedIn: 'root'
})
export class CdcResolverService implements Resolve<Result<CentroDiCosto>> {

  constructor(private readonly client: CdcService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Result<CentroDiCosto>> {
    return this.client.find();
  }
}
