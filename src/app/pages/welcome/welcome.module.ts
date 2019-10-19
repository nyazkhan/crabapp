import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WelcomePage } from './welcome.page';

const routes: Routes = [
  {
    path: '',
    component: WelcomePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WelcomePage]
})
export class WelcomePageModule {}




// $(document).ready(function(){
//   $("ion-row ion-col").click(function(){
//     $('ion-col').removeClass("font-active");
//     $(this).addClass("font-active");
// });
// });


