import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a todo', () => {
    service.addTodo('Test Todo');
    const todos = service.todos();
    expect(todos.length).toBe(1);
    expect(todos[0].title).toBe('Test Todo');
    expect(todos[0].completed).toBeFalse();
  });

  it('should toggle a todo', () => {
    service.addTodo('Test Todo');
    const todoId = service.todos()[0].id;

    service.toggleTodo(todoId);
    expect(service.todos()[0].completed).toBeTrue();

    service.toggleTodo(todoId);
    expect(service.todos()[0].completed).toBeFalse();
  });

  it('should delete a todo', () => {
    service.addTodo('Test Todo');
    const todoId = service.todos()[0].id;

    service.deleteTodo(todoId);
    expect(service.todos().length).toBe(0);
  });

  it('should compute active and completed todos', () => {
    service.addTodo('Todo 1'); // Active
    service.addTodo('Todo 2'); // Active

    const todo1Id = service.todos()[0].id;
    service.toggleTodo(todo1Id); // Todo 1 becomes Completed

    expect(service.activeTodos().length).toBe(1);
    expect(service.completedTodos().length).toBe(1);
    expect(service.activeTodos()[0].title).toBe('Todo 2');
    expect(service.completedTodos()[0].title).toBe('Todo 1');
  });
});
