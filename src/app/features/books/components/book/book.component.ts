import { CommonModule } from '@angular/common'
import { Component, DestroyRef, inject, Input, OnInit, ViewChild } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { BookService } from '@features/books/services/book.service'
import type { Book } from '@shared/interface/responses'
import { Subject, switchMap } from 'rxjs'

import { BookFormComponent } from '../book-form/book-form.component'

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule, BookFormComponent],
  templateUrl: './book.component.html',
})
export class BookComponent implements OnInit {
  @Input() book!: Book;
  @ViewChild(BookFormComponent) formCmp!: BookFormComponent;

  private bookService = inject(BookService);
  private destroyRef = inject(DestroyRef);

  private triggerSave$ = new Subject<Book>();

  save$ = this.triggerSave$.pipe(
    switchMap((book) => this.bookService.edit({
      ...book,
      id: this.book.id,
    })),
  )

  ngOnInit(): void {
    this.save$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  save(book: Book): void {
    this.triggerSave$.next(book);
  }
}
