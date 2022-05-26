import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
 

const routes: Routes = [
  {
    path: "",
    redirectTo: "start",
    pathMatch: "full"
  },
  {
    path: 'start',
    loadChildren: './pages/start/start.module#StartPageModule'
  },
  {
    path: 'select',
    loadChildren:'./pages/select/select.module#SelectPageModule'
  },
  {
    path: 'select-category',
    loadChildren:'./pages/select-category/select-category.module#SelectCategoryPageModule'
  },

  { path: "home", loadChildren: "./pages/home/home.module#HomePageModule" },  
  {
    path: "contact",
    loadChildren: "./pages/contact/contact.module#ContactPageModule"
  },  
  {
    path: "category",
    loadChildren: "./pages/category/category.module#CategoryPageModule"
  },
 
  { path: "term", loadChildren: "./pages/term/term.module#TermPageModule" },
  {
    path: 'result',
    loadChildren:"./pages/result/result.module#ResultPageModule"
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
