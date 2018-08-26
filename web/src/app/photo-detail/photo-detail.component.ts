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
    const move = fromEvent(document, 'mousemove').pipe(throttleTime(300), mapTo(false));
    const nomove = fromEvent(document, 'mousemove').pipe(startWith(0), debounceTime(300), mapTo(true));

    move.pipe(
      merge(nomove),
      tap(x => console.log('FROM TAP', x)),
      switchMap(e => {
        // Return false to hide meta, true to show meta when mouse movement is detected
        const j = e ? of(false).pipe(delay(2000)) : of(true);
        return j;
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
