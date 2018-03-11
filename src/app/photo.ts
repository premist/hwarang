interface Exif {
  [key: string]: string;
}

export class Photo {
  id: string;
  title: string;
  created_at: number;
  original: string;
  exif: Exif;
}
