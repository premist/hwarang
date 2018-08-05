import { DocumentData } from '@firebase/firestore-types';

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
    if(this.exif.f_number == undefined) { return null; }
    return `f/${this.exif.f_number}`;
  }

  get capturedAtFormatted() {
    if(this.captured_at === undefined) { return null; }

    let year = this.captured_at.getFullYear();
    let month = this.captured_at.getMonth()+1;
    let date = this.captured_at.getDate();
    return `${year}-${month}-${date}`;
  }

  get exposureTimeFormatted() {
    if(this.exif.exposure_time === undefined) { return null; }
    return `${this.exif.exposure_time}s`;
  }

  get ISOFormatted() {
    if(this.exif.iso === undefined) { return null; }
    return `ISO ${this.exif.iso}`;
  }

  static fromDocumentDataWithId(documentData: DocumentData, id: string): Photo {
    let photo = new Photo();
    photo.id = id;
    photo.title = documentData.title;
    photo.created_at = new Date(documentData.created_at*1000);
    if (documentData.captured_at !== null && documentData.captured_at !== undefined) {
      photo.captured_at = new Date(documentData.captured_at*1000);
    }
    photo.original = documentData.original;
    photo.thumbnail = documentData.thumbnail;
    photo.exif = documentData.exif;

    return photo;
  }
}
