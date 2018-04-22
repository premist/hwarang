import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { AngularFirestore, DocumentChangeAction } from 'angularfire2/firestore';
import { DocumentData } from '@firebase/firestore-types';

import { Photo } from './photo';
import { ActionSequence } from 'protractor';

@Injectable()
export class PhotoService {
  photos: Observable<Photo[]>;

  constructor(private db: AngularFirestore) { }

  getPhotosFromCollection(collection: string): Observable<Photo[]> {
    return this.db.collection<Photo>('photos', ref =>
      ref.where(`collections.${collection}`, '==', true).orderBy('captured_at', 'desc')
    )
      .snapshotChanges()
      .map(actions => this.actionToPhotos(actions));
  }

  getPhotos(): Observable<Photo[]> {
    return this.db.collection<Photo>('photos', ref => ref.orderBy('captured_at', 'desc'))
      .snapshotChanges()
      .map(actions => this.actionToPhotos(actions));
  }

  getPhoto(id: string): Observable<Photo> {
    return this.db.doc<DocumentData>(`photos/${id}`).valueChanges()
      .map(data => Photo.fromDocumentDataWithId(data, id));
  }

  private actionToPhotos(actions: DocumentChangeAction[]): Photo[] {
    return actions.map(action => {
        const doc = action.payload.doc;
        return Photo.fromDocumentDataWithId(doc.data(), doc.id);
    });
  }
}
