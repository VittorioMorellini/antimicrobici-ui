import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

interface Model {
  reason?: string;
}

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.scss']
})
export class ForbiddenComponent implements OnInit {
  readonly model: Observable<Model>;

  constructor(private readonly route: ActivatedRoute) {
    this.model = route.params.pipe(
      map((params: { reason?: string }) => ({reason: params.reason}))
    );
  }

  ngOnInit() {
  }

}
