import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Todo } from '../../features/todo/models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoApiService {
  private readonly STORAGE_KEY = 'mock_api_todos';
  private platformId = inject(PLATFORM_ID);

  // Simulated network delay in ms
  private readonly LATENCY = 800;

  private getTodosFromStorage(): Todo[] {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return [];
        }
      }
    }
    return [];
  }

  private saveTodosToStorage(todos: Todo[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
    }
  }

  getTodos(): Observable<Todo[]> {
    return of(this.getTodosFromStorage()).pipe(delay(this.LATENCY));
  }

  addTodo(title: string): Observable<Todo> {
    const todos = this.getTodosFromStorage();
    const newTodo: Todo = {
      // Create a random UUID-like string
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36),
      title,
      completed: false,
      createdAt: Date.now()
    };

    todos.push(newTodo);
    this.saveTodosToStorage(todos);

    return of(newTodo).pipe(delay(this.LATENCY));
  }

  toggleTodo(id: string): Observable<Todo> {
    const todos = this.getTodosFromStorage();
    const index = todos.findIndex(t => t.id === id);

    if (index === -1) {
      return throwError(() => new Error('Todo not found'));
    }

    todos[index].completed = !todos[index].completed;
    this.saveTodosToStorage(todos);

    return of(todos[index]).pipe(delay(this.LATENCY));
  }

  deleteTodo(id: string): Observable<void> {
    let todos = this.getTodosFromStorage();
    const initialLength = todos.length;
    todos = todos.filter(t => t.id !== id);

    if (todos.length === initialLength) {
      return throwError(() => new Error('Todo not found'));
    }

    this.saveTodosToStorage(todos);
    return of(void 0).pipe(delay(this.LATENCY));
  }
}
