import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';

import {ApiClientService} from './client.service';
import {UserProfile} from './dto';

@Injectable()
export class UserService {

  constructor(private readonly client: ApiClientService) {}

  load(): Observable<UserProfile> {
    return this.client.get<UserProfile>('user');
  }
}
