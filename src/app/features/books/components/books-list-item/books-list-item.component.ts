import { CommonModule } from '@angular/common'
import { Component, inject, Input, TemplateRef, ViewChild } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { BookService } from '@features/books/services/book.service'
import type { Book } from '@shared/interface/responses'
import { take } from 'rxjs'

import { BookFormComponent } from '../book-form/book-form.component'

@Component({
  selector: 'app-books-list-item',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatGridListModule,
    MatIconModule,
    MatListModule,
    BookFormComponent,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  providers: [BookService],
  templateUrl: './books-list-item.component.html',
})
export class BooksListItemComponent {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<unknown>;

  @Input() book!: Book;

  private bookService = inject(BookService);
  private dialog = inject(MatDialog);

  loading$ = this.bookService.getLoading();

  deleteHandler(id: string) {
    this.bookService.delete(id).pipe(take(1)).subscribe();
  }

  edit(book: Book): void {
    this.bookService.edit(book).pipe(take(1)).subscribe();
    this.dialog.closeAll();
  }

  openDialog(): void {
    this.dialog.open(this.dialogTemplate);
  }
}
