import { CommonModule } from '@angular/common'
import { Component, inject, TemplateRef, ViewChild } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { BookService } from '@features/books/services/book.service'
import { Book } from '@shared/interface/responses'
import { map, merge, shareReplay, Subject, switchMap } from 'rxjs'

import { BookFormComponent } from '../book-form/book-form.component'

@Component({
  selector: 'app-create-book',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatDialogModule,  MatButtonModule, BookFormComponent],
  templateUrl: './create-book.component.html',
})
export class CreateBookComponent {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<unknown>;

  private bookService = inject(BookService);
  private dialog = inject(MatDialog);

  private triggerAdd$ = new Subject<Book>();
  private add$ = this.triggerAdd$.pipe(
    switchMap((book) => this.bookService.create(book)),
    shareReplay({ bufferSize: 1, refCount: true }),
  )

  adding$ = merge(
    this.triggerAdd$.pipe(map(() => true)),
    this.add$.pipe(map(() => false)),
  );

  save(book: Book): void {
    this.triggerAdd$.next(book);
    this.dialog.closeAll();
  }

  openDialog(): void {
    this.dialog.open(this.dialogTemplate);
  }
}
