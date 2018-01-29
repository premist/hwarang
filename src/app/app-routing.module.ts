import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhotosComponent } from './photos/photos.component';
import { PhotoDetailComponent } from './photo-detail/photo-detail.component';

const routes: Routes = [
  { path: '', component: PhotosComponent },
  { path: 'photos/:id', component: PhotoDetailComponent, outlet: 'photo' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
