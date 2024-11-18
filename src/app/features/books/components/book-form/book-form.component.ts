import { CommonModule } from '@angular/common'
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core'
import { FormBuilder, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { Book } from '@shared/interface/responses'

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './book-form.component.html',
  styles: `:host { display: block; padding: 10px 0;}`
})
export class BookFormComponent implements OnChanges {
  @Input() book?: Book | null;

  @Output() save = new EventEmitter<Book>();

  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild(FormGroupDirective)
  formDir!: FormGroupDirective;

  form = this.fb.group({
    title: this.fb.nonNullable.control(
      '',
      [Validators.required],
    ),
    author: this.fb.nonNullable.control(
      '',
      [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(/^[A-Za-z0-9](?:[A-Za-z0-9 ]*[A-Za-z0-9])?$/)
      ]
    ),
    year: this.fb.control(
      null,
      [Validators.required, Validators.max(new Date().getFullYear())],
    ),
    description: this.fb.nonNullable.control(''),
    image: this.fb.nonNullable.control(''),
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['book'] && changes['book'].currentValue) {
      queueMicrotask(() => this.formDir.resetForm(this.book))
    }
  }

  saveHandler() {
    this.save.emit({
      ...this.form.value,
      id: this.book?.id,
    } as Book);
  }

  fileChangeHandler(event: Event) {
    const file = (event.target as HTMLInputElement)!.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.form.patchValue({
        image: reader.result as string,
      });
      this.form.markAsDirty();
      this.cdr.markForCheck();
    };

    reader.readAsDataURL(file);
  }

  deleteImage() {
    this.form.patchValue({
      image: '',
    });
    this.form.markAsDirty();
    this.cdr.markForCheck();
  }
}
