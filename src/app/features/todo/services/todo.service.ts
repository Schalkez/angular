import { Injectable, signal, computed, inject } from '@angular/core';
import { Todo } from '../models/todo.model';
import { TodoApiService } from '../../../core/api/todo-api.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiService = inject(TodoApiService);

  // State Signals
  private todosSignal = signal<Todo[]>([]);
  private isLoadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Selectors
  readonly todos = this.todosSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly completedTodos = computed(() =>
    this.todosSignal().filter(todo => todo.completed)
  );

  readonly activeTodos = computed(() =>
    this.todosSignal().filter(todo => !todo.completed)
  );

  constructor() {
    this.loadTodos();
  }

  loadTodos(): void {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.getTodos().pipe(
      catchError(err => {
        this.errorSignal.set('Failed to load todos');
        return of([]);
      }),
      finalize(() => this.isLoadingSignal.set(false))
    ).subscribe(todos => {
      this.todosSignal.set(todos);
    });
  }

  addTodo(title: string): void {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.addTodo(title).pipe(
      catchError(err => {
        this.errorSignal.set('Failed to add todo');
        return of(null);
      }),
      finalize(() => this.isLoadingSignal.set(false))
    ).subscribe(newTodo => {
      if (newTodo) {
        this.todosSignal.update(todos => [...todos, newTodo]);
      }
    });
  }

  toggleTodo(id: string): void {
    // Optimistic UI update or full loading block
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.toggleTodo(id).pipe(
      catchError(err => {
        this.errorSignal.set('Failed to toggle todo');
        return of(null);
      }),
      finalize(() => this.isLoadingSignal.set(false))
    ).subscribe(updatedTodo => {
      if (updatedTodo) {
        this.todosSignal.update(todos =>
          todos.map(todo => (todo.id === id ? updatedTodo : todo))
        );
      }
    });
  }

  deleteTodo(id: string): void {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    this.apiService.deleteTodo(id).pipe(
      catchError(err => {
        this.errorSignal.set('Failed to delete todo');
        return of(false); // return false on error
      }),
      finalize(() => this.isLoadingSignal.set(false))
    ).subscribe(success => {
      if (success !== false) {
        this.todosSignal.update(todos => todos.filter(todo => todo.id !== id));
      }
    });
  }
}
