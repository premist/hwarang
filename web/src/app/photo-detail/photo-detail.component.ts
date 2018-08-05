import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { PhotoService } from '../photo.service';
import { Photo } from '../photo';

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.less']
})
export class PhotoDetailComponent implements OnInit {
  @Input() photo: Photo;

  constructor(
    private route: ActivatedRoute,
    private photoService: PhotoService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getPhoto();
  }

  getPhoto(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.photoService.getPhoto(id)
      .subscribe(photo => this.photo = photo);
  }

  closeModal() {
  }
}
