import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { NamedEntity, Result, MatScadutoCatalogo } from '../api/dto';
import { MaterialiService } from '../api/materiali.service';
import { CatalogoService } from '../api/catalogo.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogoResolverService implements Resolve<Result<MatScadutoCatalogo>> {

  constructor(private readonly client: CatalogoService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Result<MatScadutoCatalogo>> {
    return this.client.find();
  }
}
