import { h, app } from 'hyperapp'
import picostyle from 'picostyle'

const ps = picostyle(h)

const STORAGE_KEY = 'MyNameIsBond'

const fetchTodos = () => {
  return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || []
}

const state = {
  todoValue: '',
  todos: fetchTodos()
}

const actions = {
  onInput: value => state => {
    state.todoValue = value
  },

  addTodo: () => state => {
    if (!state.todoValue.length) return
    state.todos.push({
      id: state.todos.length,
      value: state.todoValue,
      completed: false
    })
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos))
    state.todoValue = ''
    return state.todos
  },

  removeTodo: id => state => {
    state.todos = state.todos.filter(todo => todo.id !== id)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos))
    return state.todos
  },

  handleCheckbox: index => state => {
    state.todos[index].completed = !state.todos[index].completed
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos))
    return state.todos
  }
}

const view = (state, actions) => {
  const Wrapper = ps('main')({
    width: '700px',
    textAlign: 'center',
    margin: '24px auto 0 auto',
    background: '#fff',
    // display: 'flex',
    // alignItems: 'center',
    // // flexDirection: 'column',
  })

  const Title = ps('h1')({
    color: '#24b47e',
    fontSize: '100px',
    fontWeight: '500',
    textTransform: 'uppercase'
  })

  const TodoInput = ps('input')({
    boxSizing: 'border-box',
    width: '100%',
    padding: '16px',
    fontSize: '24px',
    outline: '0',
    color: '#6b7c93',
    fontWeight: '100',
    borderRadius: '3px',
    border: '1px solid #fff',
    ':focus': {
    },
    '::placeholder': {
      opacity: '.5',
    }
  })

  const Checkbox = ps('input')({
    borderRadius: '50%'
  })
  const TodoLists = ps('ul')({
    width: '100%',
    listStyleType: 'none'
  })

  const TodoListsItem = ps('li')({
    display: 'inline-block',
    '.completed': {
      opacity: '.5',
      textDecoration: 'line-through'
    }
  })
  return(
    <Wrapper>
      <Title>todos</Title>
      <TodoInput
        type="text"
        placeholder="What's needs to be done?"
        value={state.todoValue}
        oninput={e => actions.onInput(e.target.value)}
        onkeydown={e => e.keyCode === 13 ? actions.addTodo : ''}
      />
      { /*<button
        onclick={actions.addTodo}
      >Add</button>
        */}

      <TodoLists>
      {
        state.todos.map((todo, index) => {
          return(
            <div>
              <input
                type="checkbox"
                checked={todo.completed}
                onclick={() => actions.handleCheckbox(index)}
                onkeydown={e => e.keyCode === 13 ? actions.addTodo : ''}
              />

              <TodoListsItem
              class={todo.completed ? "completed" : ""}
              >{todo.value}</TodoListsItem>

              <span
                onclick={() => actions.removeTodo(todo.id)}
              >×</span>
            </div>
          )
        })
      }
      </TodoLists>
    </Wrapper>
  )
}

export const main = app(state, actions, view, document.body)
