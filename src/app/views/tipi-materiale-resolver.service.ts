import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { NamedEntity, Result } from '../api/dto';
import { TipiMaterialeService } from '../api/tipi-materiale.service';

@Injectable({
  providedIn: 'root'
})
export class TipiMaterialeResolverService implements Resolve<Result<NamedEntity>> {

  constructor(private readonly client: TipiMaterialeService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Result<NamedEntity>> {
    return this.client.find();
  }
}
