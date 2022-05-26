import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from "@angular/router";
import { IonicModule } from '@ionic/angular';
import { SharedModule } from "src/app/shared/shared.module";
 
import { CategoriesComponent } from "src/app/shared/components/categories/categories.component";
import { SelectCategoryPage } from './select-category.page';

const routes: Routes = [
  {
    path: "",
    component: SelectCategoryPage
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [SelectCategoryPage, CategoriesComponent],
  exports: [CategoriesComponent]
})
export class SelectCategoryPageModule {}
