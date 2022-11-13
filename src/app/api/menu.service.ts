import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';

import {ApiClientService} from './client.service';
import {MenuProfile} from './dto';

@Injectable()
export class MenuService {

  constructor(private readonly client: ApiClientService) {}

  load(): Observable<MenuProfile> {
    return this.client.get<MenuProfile>('menu');
  }
}
