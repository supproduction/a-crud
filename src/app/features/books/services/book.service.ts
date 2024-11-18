import { HttpClient, HttpParams } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Book } from '@shared/interface/responses'
import { finalize, Observable, Subject, switchMap } from 'rxjs'

import { BooksService } from './books.service'

@Injectable()
export class BookService {
  private http = inject(HttpClient);
  private books = inject(BooksService);
  private loading$ = new Subject<boolean>();

  delete(id: string): Observable<null> {
    const params = new HttpParams().set('id', id);
    this.loading$.next(true);

    return this.http.delete<null>('delete', { params }).pipe(
      switchMap(() => this.books.reload()),
      finalize(() => this.loading$.next(false))
    )
  }

  edit(book: Book): Observable<null> {
    this.loading$.next(true);

    return this.http.put<null>('edit', book).pipe(
      switchMap(() => this.books.reload()),
      finalize(() => this.loading$.next(false))
    )
  }

  create(book: Omit<Book, 'id'>): Observable<null> {
    this.loading$.next(true);

    return this.http.put<null>('create', book).pipe(
      switchMap(() => this.books.reload()),
      finalize(() => this.loading$.next(false))
    )
  }

  get(id: string): Observable<Book> {
    const params = new HttpParams().set('id', id);
    this.loading$.next(true);

    return this.http.get<Book>('get', { params }).pipe(
      finalize(() => this.loading$.next(false))
    )
  }

  getLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }
}
