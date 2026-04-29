import { Component, EventEmitter, Output, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-input.component.html',
  styleUrl: './todo-input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoInputComponent {
  @Output() addTodo = new EventEmitter<string>();

  title = signal('');

  onSubmit(): void {
    if (this.title().trim()) {
      this.addTodo.emit(this.title());
      this.title.set('');
    }
  }
}
