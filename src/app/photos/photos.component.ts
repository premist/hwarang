import { Component, OnInit, Input } from '@angular/core';
import { Photo } from '../photo';
import { PhotoService } from '../photo.service';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.less']
})
export class PhotosComponent implements OnInit {
  @Input() collectionName?: string;
  photos: Photo[];

  constructor(private photoService: PhotoService) { }

  ngOnInit() {
    this.getPhotos();
  }

  getPhotos(): void {
    const col = (this.collectionName === undefined)
      ? this.photoService.getPhotos()
      : this.photoService.getPhotosFromCollection(this.collectionName);

    col.subscribe(photos => this.photos = photos);
  }
}
