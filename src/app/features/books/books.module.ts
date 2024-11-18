import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { BooksRoutingModule } from './books-routing.module'
import { BookService } from './services/book.service'
import { BooksService } from './services/books.service'

@NgModule({
  imports: [
    CommonModule,
    BooksRoutingModule,
  ],
  providers: [BooksService, BookService],
})
export class BooksModule {}
