import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhotosComponent } from './photos/photos.component';
import { PhotoDetailComponent } from './photo-detail/photo-detail.component';
import { LicenseComponent } from './license/license.component';

const routes: Routes = [
  { path: '', component: PhotosComponent },
  { path: 'photos/:id', component: PhotoDetailComponent },
  { path: 'license', component: LicenseComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
