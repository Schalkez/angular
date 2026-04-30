import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { TodoInputComponent } from '../../components/todo-input/todo-input.component';
import { TodoListComponent } from '../../components/todo-list/todo-list.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message.component';

@Component({
  selector: 'app-todo-page',
  standalone: true,
  imports: [TodoInputComponent, TodoListComponent, LoadingSpinnerComponent, ErrorMessageComponent],
  templateUrl: './todo-page.component.html',
  styleUrl: './todo-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoPageComponent {
  private todoService = inject(TodoService);

  // Expose signals from service
  todos = this.todoService.todos;
  isLoading = this.todoService.isLoading;
  error = this.todoService.error;
  activeCount = this.todoService.activeTodos;
  completedCount = this.todoService.completedTodos;

  addTodo(title: string): void {
    this.todoService.addTodo(title);
  }

  toggleTodo(id: string): void {
    this.todoService.toggleTodo(id);
  }

  deleteTodo(id: string): void {
    this.todoService.deleteTodo(id);
  }
}
