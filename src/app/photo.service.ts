import { Injectable } from '@angular/core';

import { Photo } from './photo';

@Injectable()
export class PhotoService {

  constructor() { }

  getPhotos(): Photo[] {
    return [
      { id: 'rtQTLUR2L3Qo7Jc6vQpN', created_at: 1516523052, title: 'Namsan', url_original: 'https://storage.googleapis.com/hwarangapp.appspot.com/2018/1/21/f7ae94' }
    ];
  }
}
