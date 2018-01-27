import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { AngularFirestore } from 'angularfire2/firestore';

import { Photo } from './photo';

@Injectable()
export class PhotoService {
  photos: Observable<Photo[]>;

  constructor(private db: AngularFirestore) { }

  getPhotos(): Observable<Photo[]> {
    return this.db.collection<Photo>('photos', ref => ref.orderBy('created_at', 'desc')).valueChanges();
  }
}
