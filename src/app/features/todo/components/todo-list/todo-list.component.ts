import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [TodoItemComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent {
  @Input({ required: true }) todos!: Todo[];
  @Output() toggle = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
}
