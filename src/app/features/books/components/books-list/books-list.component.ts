import { animate, style, transition, trigger } from '@angular/animations'
import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { Book } from '@shared/interface/responses'
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, merge, shareReplay, switchMap } from 'rxjs'

import { BooksService } from '../../services/books.service'
import { BookFormComponent } from '../book-form/book-form.component'
import { BooksListItemComponent } from '../books-list-item/books-list-item.component'
import { CreateBookComponent } from '../create-book/create-book.component'

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    BookFormComponent,
    MatProgressSpinnerModule,
    MatListModule,
    BooksListItemComponent,
    CreateBookComponent,
  ],
  templateUrl: './books-list.component.html',
  animations: [
    trigger('itemAnimation', [
      transition(':enter', [
        style({ height: '0', opacity: 0 }),
        animate('150ms ease-out', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ height: '0', opacity: 0 }))
      ])
    ])
  ]
})
export class BookListComponent {
  private booksService = inject(BooksService);

  private getList$ = new BehaviorSubject<null>(null);
  private searchQuery$ = new BehaviorSubject<string | null>(null);
  private search$ = this.searchQuery$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
  )

  books$ = this.getList$.pipe(
    switchMap(() => this.booksService.get()),
    switchMap((books) => this.search$.pipe().pipe(
      map((query) => this.filterBooks(books, query)),
    )),
    shareReplay({ bufferSize: 1, refCount: true })
  );
  initialLoading$ = merge(
    this.getList$.pipe(map(() => true)),
    this.books$.pipe(map(() => false))
  );

  filterBooks(books: Book[], query: string | null): Book[] {
    if (!query) {
      return books;
    }

    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
    );
  }

  searchHandler(event: Event): void {
    this.searchQuery$.next((event.target as HTMLInputElement).value);
  }
}

