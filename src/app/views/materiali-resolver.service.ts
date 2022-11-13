import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';

import {Observable} from 'rxjs';

import {NamedEntity, Result} from '../api/dto';
import {MaterialiService} from '../api/materiali.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialiResolverService implements Resolve<Result<NamedEntity>> {

  constructor(private readonly client: MaterialiService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Result<NamedEntity>> {
    return this.client.find();
  }
}
