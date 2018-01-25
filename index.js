import { h, app } from 'hyperapp'
import picostyle from 'picostyle'

const ps = picostyle(h)

const STORAGE_KEY = 'MyNameIsBond'
const WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const fetchTodos = () => {
  return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || []
}

const dayName = () => {
  const today = new Date()
  return WEEK[today.getDay()]
}

const state = {
  todoValue: '',
  todos: fetchTodos(),
  dayName: dayName()
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
  },
}

const view = (state, actions) => {
  const Wrapper = ps('main')({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  })

  const Content = ps('section')({
    position: 'relative',
    height: '550px',
    width: '550px',
    background: '#fff',
    boxShadow: '0 50px 100px rgba(50,50,93,.1), 0 15px 35px rgba(50,50,93,.15), 0 5px 15px rgba(0,0,0,.1)',
    borderRadius: '3px',
  })

  const Week = ps('h1')({
    margin: '24px 0 24px 0',
    color: '#32325d',
    fontSize: '48px',
    fontWeight: '500',
  })

  const TodoInput = ps('input')({
    position: 'absolute',
    bottom: '0',
    left: '0',
    width: '100%',
    padding: '16px',
    borderRadius: '0 0 3px 3px',
    fontSize: '24px',
    fontWeight: '200',
    '::placeholder': {
      opacity: '.5',
    }
  })

  const Checkbox = ps('input')({
  })
  const TodoLists = ps('ul')({
    listStyleType: 'none'
  })

  const TodoListsItem = ps('li')({
    display: 'inline-block',
  })
  return(
    <Wrapper>
      <Content>
        <Week>{ state.dayName }</Week>
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
        <TodoInput
          type="text"
          placeholder="What needs to be done?"
          value={state.todoValue}
          oninput={e => actions.onInput(e.target.value)}
          onkeydown={e => e.keyCode === 13 ? actions.addTodo : ''}
        />
        { /*<button
          onclick={actions.addTodo}
        >Add</button>
          */}
      </Content>
    </Wrapper>
  )
}

export const main = app(state, actions, view, document.body)
