import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

class Todo {
  constructor(
      public readonly id: number,
      public readonly title: string,
      public readonly author: string,
  ) {
  }

  static createEmpty(): Todo {
    return new Todo(-1, '', '')
  }
}

const todoRoot = 'todo'
const todoPrefix = 'todo_'

export const useTodoStore = defineStore('todo', () => {
  const todoList = ref<Todo[]>([])

  function readAllTodo() {
    const sizeOfTodoList = __getSizeOfTodoList()
    const keys = Array.from(Array(sizeOfTodoList).keys())
        .map(id => {
          const storageKey = __getTodoStorageKey(id)
          const todo = localStorage.getItem(storageKey)
          if (todo === null) return null
          const todoObject = JSON.parse(todo)
          return new Todo(todoObject['id'], todoObject['title'], todoObject['author'])
        })
  }

  function saveTodo(title: string, author: string) {
    const todoSize = __getSizeOfTodoList()
    const todo = new Todo(todoSize, title, author)

    const _id = __getTodoStorageKey(__getSizeOfTodoList())
    const newSizeOfTodo = __getSizeOfTodoList() + 1
    localStorage.setItem(_id, JSON.stringify(todo))
    localStorage.setItem(todoRoot, newSizeOfTodo.toString(10))
    todoList.value.push(todo)
  }

  function clearAll() {
    todoList.value.length = 0
    localStorage.clear()
  }

  function __getSizeOfTodoList(): number {
    const todoSize = localStorage.getItem(todoRoot) ?? '0';
    return Number.parseInt(todoSize)
  }

  function __getTodoStorageKey(id: number): string {
    return todoPrefix + id.toString(10)
  }

  return { todoList, readAllTodo, saveTodo, clearAll }
})
