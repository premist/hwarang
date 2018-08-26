import * as firebase from 'firebase/app';
import 'firebase/firestore';

interface Exif {
  [key: string]: string;
}

export class Photo {
  id: string;
  title: string;
  created_at: Date;
  captured_at: Date;
  original: string;
  thumbnail: string;
  exif: Exif;

  get fNumberFormatted() {
    if (this.exif.f_number === undefined) { return null; }
    return `f/${this.exif.f_number}`;
  }

  get capturedAtFormatted() {
    if (this.captured_at === undefined) { return null; }

    const year = this.captured_at.getFullYear();
    const month = this.captured_at.getMonth() + 1;
    const date = this.captured_at.getDate();
    return `${year}-${month}-${date}`;
  }

  get exposureTimeFormatted() {
    if (this.exif.exposure_time === undefined) { return null; }
    return `${this.exif.exposure_time}s`;
  }

  get ISOFormatted() {
    if (this.exif.iso === undefined) { return null; }
    return `ISO ${this.exif.iso}`;
  }

  static fromDocumentDataWithId(documentData: firebase.firestore.DocumentData, id: string): Photo {
    const photo = new Photo();
    photo.id = id;
    photo.title = documentData.title;
    photo.created_at = this.parseDate(documentData.created_at);
    if (documentData.captured_at !== null && documentData.captured_at !== undefined) {
      photo.captured_at = this.parseDate(documentData.captured_at);
    }
    photo.original = documentData.original;
    photo.thumbnail = documentData.thumbnail;
    photo.exif = documentData.exif;

    return photo;
  }

  static parseDate(date: number | firebase.firestore.Timestamp): Date {
    if (typeof date === 'number') {
      return new Date(date * 1000);
    } else if (date instanceof firebase.firestore.Timestamp) {
      return new Date(date.seconds * 1000);
    }
  }
}
