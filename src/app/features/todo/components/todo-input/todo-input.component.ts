import { Component, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-input',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './todo-input.component.html',
  styleUrl: './todo-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoInputComponent {
  @Output() addTodo = new EventEmitter<string>();

  // Use Reactive Forms to prevent whitespace-only input
  titleControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/.*[^ ].*/)]
  });

  onSubmit(): void {
    if (this.titleControl.valid) {
      this.addTodo.emit(this.titleControl.value.trim());
      this.titleControl.reset('');
    }
  }
}
