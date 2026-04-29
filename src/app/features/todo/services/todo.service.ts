import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private platformId = inject(PLATFORM_ID);

  // State
  private todosSignal = signal<Todo[]>([]);

  // Selectors
  readonly todos = this.todosSignal.asReadonly();

  readonly completedTodos = computed(() =>
    this.todosSignal().filter(todo => todo.completed)
  );

  readonly activeTodos = computed(() =>
    this.todosSignal().filter(todo => !todo.completed)
  );

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        try {
          this.todosSignal.set(JSON.parse(savedTodos));
        } catch (e) {
          console.error('Failed to parse todos from local storage', e);
        }
      }

      effect(() => {
        const todos = this.todosSignal();
        localStorage.setItem('todos', JSON.stringify(todos));
      });
    }
  }

  addTodo(title: string): void {
    const newTodo: Todo = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      completed: false,
      createdAt: Date.now()
    };
    this.todosSignal.update(todos => [...todos, newTodo]);
  }

  toggleTodo(id: string): void {
    this.todosSignal.update(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  deleteTodo(id: string): void {
    this.todosSignal.update(todos => todos.filter(todo => todo.id !== id));
  }
}
