import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';

import {Observable} from 'rxjs';

import {RichiestaRecord, Result, WithAggregations} from '../../api/dto';
import {DottoriService} from '../../api/dottori.service';

@Injectable({
  providedIn: 'root'
})
export class DottoriResolverService implements Resolve<Result<RichiestaRecord>> {

  constructor(private readonly client: DottoriService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Result<RichiestaRecord>> {
    return this.client.find();
  }
}
