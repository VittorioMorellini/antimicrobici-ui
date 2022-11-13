import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';

import {Observable} from 'rxjs';

import {NamedEntity, Result} from '../api/dto';
import {StatiService} from '../api/stati.service';

@Injectable({
  providedIn: 'root'
})
export class StatiResolverService implements Resolve<Result<NamedEntity>> {

  constructor(private readonly client: StatiService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Result<NamedEntity>> {
    return this.client.find();
  }
}
