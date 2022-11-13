import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';

import {Observable} from 'rxjs';

import {NamedEntity, Result} from '../api/dto';
import {RichiedentiService} from '../api/richiedenti.service';

@Injectable({
  providedIn: 'root'
})
export class RichiedentiResolverService implements Resolve<Result<NamedEntity>> {

  constructor(private readonly client: RichiedentiService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Result<NamedEntity>> {
    return this.client.find();
  }
}
