import { h, app } from 'hyperapp'
import picostyle from 'picostyle'

const ps = picostyle(h)
const STORAGE_KEY = 'MyNameIsBond'

const state = {
  text: '',
  todos: []
}

const actions = {
  changeText: input => state => { state.text = input },

  addTodo: () => (state, actions) => {
    // validate empty text
    if (!state.text.length) return
    state.todos.push(state.text)
    actions.todosAddID()
    actions.setDataToLocalStorage(actions.todosMakesJson())
    state.text = ''
    return state.todos
  },

  // TODO: All array loop, because make wrong json
  // EX {"id": "1", "todo": {.....},...}
  todosAddID: () => state => {
    debugger
    const tmp = state.todos.map((todo, index) => {
      return {
        id: index,
        todo: todo
      }
      state.todos = tmp
      return state.todos
    })
  },

  todosMakesJson: () => state => {
    return JSON.stringify(state.todos)
  },

  setDataToLocalStorage: (json) => state => {
    window.localStorage.setItem(STORAGE_KEY, json)
  }
}

const view = (state, actions) => {
  const TodoInput = ps('input')({
    padding: '4px',
    // borderRadius: '3px',
    outline: '0'
  })

  return (
    <main>
      <TodoInput value={state.text} oninput={e => actions.changeText(e.target.value)}/>
      <button onclick={actions.addTodo}>Add</button>

      <ul>
      {
        state.todos.map(n => {
          return <li>{n.todo}</li>
        })
      }
      </ul>
    </main>
  )
}

export const main = app(state, actions, view, document.body)
