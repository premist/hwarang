import { Component, OnInit } from '@angular/core';
import { Router, ActivationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

import { PhotoDetailComponent } from '../photo-detail/photo-detail.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  router: Router;
  darkroom: boolean = false;

  constructor(router: Router) {
    this.router = router;
  }

  ngOnInit() {
    this.router.events.pipe(filter(e => e instanceof ActivationStart)).subscribe((e: ActivationStart) => {
      if (e.snapshot.component === PhotoDetailComponent) {
        this.darkroom = true;
      } else {
        this.darkroom = false;
      }
    });
  }
}
