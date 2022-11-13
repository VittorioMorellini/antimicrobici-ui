import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';

import {Observable} from 'rxjs';

import {RichiestaRecord, Result, WithAggregations} from '../../api/dto';
import {RichiesteService} from '../../api/richieste.service';

@Injectable({
  providedIn: 'root'
})
export class RichiesteResolverService implements Resolve<Result<RichiestaRecord>> {

  constructor(private readonly client: RichiesteService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Result<RichiestaRecord>> {
    return this.client.find();
  }
}
