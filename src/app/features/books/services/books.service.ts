import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Book } from '@shared/interface/responses'
import { BehaviorSubject, filter, map, merge, Observable, share, switchMap } from 'rxjs'

@Injectable()
export class BooksService {
  private http = inject(HttpClient);

  private load$ = new BehaviorSubject<void>(void 0);
  private books$ = this.load$.pipe(
    switchMap(() => this.http.get<Book[]>('get-list')),
    share(),
  )
  private loading$ = merge(
    this.load$.pipe(map(() => true)),
    this.books$.pipe(map(() => false)),
  )

  get(): Observable<Book[]> {
    return this.books$;
  }

  reload(): Observable<null> {
    this.load$.next();

    return this.loading$.pipe(
      filter((loading) => !loading),
      map(() => null)
    )
  }
}
