import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () => import('./features/books/books.module').then(module => module.BooksModule),
      },
    ],
  },
];
