import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { AngularFirestore, DocumentChangeAction } from 'angularfire2/firestore';

import { Photo } from './photo';

@Injectable()
export class PhotoService {
  photos: Observable<Photo[]>;

  constructor(private db: AngularFirestore) { }

  getPhotos(): Observable<Photo[]> {
    return this.db.collection<Photo>('photos', ref => ref.orderBy('created_at', 'desc')).snapshotChanges().map(actions => {
      return actions.map(this.processPhotoPayload);
    });
  }

  getPhoto(id: string): Observable<Photo> {
    return this.db.doc<Photo>(`photos/${id}`).valueChanges();
  }

  processPhotoPayload(action: DocumentChangeAction): Photo {
    const data = action.payload.doc.data() as Photo;
    const id = action.payload.doc.id;
    return { id, ...data };
  }
}
