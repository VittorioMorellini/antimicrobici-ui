import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';

import {Observable} from 'rxjs';

import {NamedEntity, Result} from '../api/dto';
import {PrioritaService} from '../api/priorita.service';

@Injectable({
  providedIn: 'root'
})
export class PrioritaResolverService implements Resolve<Result<NamedEntity>> {

  constructor(private readonly client: PrioritaService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Result<NamedEntity>> {
    return this.client.find();
  }
}
