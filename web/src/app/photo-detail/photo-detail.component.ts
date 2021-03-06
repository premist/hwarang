import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PhotoService } from '../photo.service';
import { Photo } from '../photo';
import { fromEvent, of } from 'rxjs';
import { throttleTime, mapTo, startWith, debounceTime, merge, switchMap, tap, delay } from 'rxjs/operators';

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.less']
})
export class PhotoDetailComponent implements OnInit {
  @Input() photo: Photo;

  private showMeta = true;

  constructor(
    private route: ActivatedRoute,
    private photoService: PhotoService
  ) { }

  ngOnInit(): void {
    this.getPhoto();
    this.detectMovementForMeta();
  }

  detectMovementForMeta(): void {
    const observable = fromEvent(document, 'mousemove').pipe(
      merge(fromEvent(document, 'scroll')),
      merge(fromEvent(document, 'touchdown')),
      merge(fromEvent(document, 'touchmove'))
    );

    const move = observable.pipe(throttleTime(300), mapTo(false));
    const nomove = observable.pipe(startWith(0), debounceTime(300), mapTo(true));

    move.pipe(
      merge(nomove),
      switchMap(e => {
        // Return false to hide meta, true to show meta when mouse movement is detected
        return e ? of(false).pipe(delay(2000)) : of(true);
      })
    ).subscribe((showMeta) => { this.showMeta = showMeta; });
  }

  getPhoto(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.photoService.getPhoto(id)
      .subscribe(photo => this.photo = photo);
  }

  closeModal() {
  }
}
