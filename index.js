import { h, app } from 'hyperapp'
import picostyle from 'picostyle'

const ps = picostyle(h)

const STORAGE_KEY = 'MyNameIsBond'
const WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const fetchTodos = () => {
  return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || []
}

const today = new Date()
const dayName = () => {
  return WEEK[today.getDay()]
}

const todayDate = () => {
  return `${MONTH[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`
}

const state = {
  todoValue: '',
  todos: fetchTodos(),
  dayName: dayName(),
  todayDate: todayDate()
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
    padding: '48px',
    background: '#fff',
    boxShadow: '0 50px 100px rgba(50,50,93,.1), 0 15px 35px rgba(50,50,93,.15), 0 5px 15px rgba(0,0,0,.1)',
    borderRadius: '3px',
  })

  const Week = ps('h1')({
    margin: '0 0 8px 0',
    color: '#32325d',
    fontSize: '48px',
    fontWeight: '500',
  })

  const Date = ps('span')({
    color: '#6b7c93',
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
    background: '#f6f9fc',
    color: '#32325d',
    letterSpacing: '1px',
    '::placeholder': {
      opacity: '.5',
    }
  })

  const TodoLists = ps('ul')({
    margin: '16px 0 0 0',
    textAlign: 'left',
    listStyleType: 'none'
  })

  const TodoListsItem = ps('li')({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    height: '50px',
    fontSize: '24px',
    letterSpacing: '1px',
    transition: 'all 240ms ease-in-out',
    ':hover': {
    },
    '.completed': {
      opacity: '.5',
      fontSize: '16px'
    },
    ' .todo-value': {
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      color: '#32325d'
    },
    ' .delete-button': {
      color: 'red',
      fontSize: '20px'
    }
  })

  const Checkbox = ps('input')({
    position: 'absolute',
    right: '0',
    display: 'block',
    width: '15px',
    height: '15px',
    margin: '0 1px 0 0',
    background: '#6b7c93',
    borderRadius: '50%',
    '::before': {
    },
    // backgroundColor: '#6772e5',
  })

  return(
    <Wrapper>
      <Content>
        <Week>{ state.dayName }</Week>
        <Date>{ state.todayDate }</Date>
        <TodoLists>
        {
          state.todos.map((todo, index) => {
            return(
                <TodoListsItem
                class={todo.completed ? "completed" : ""}
                >
                <span class="todo-value">{todo.value}</span>

                  <Checkbox
                    type="checkbox"
                    checked={todo.completed}
                    onclick={() => actions.handleCheckbox(index)}
                  ></Checkbox>

                {/* <span
                    class="delete-button"
                    onclick={() => actions.removeTodo(todo.id)}
                  >×</span>
                */}
                </TodoListsItem>
            )
          })
        }
        </TodoLists>
        <TodoInput
          type="text"
          placeholder="What needs to be done?"
          value={state.todoValue}
          oninput={e => actions.onInput(e.target.value)}
          onkeydown={e => e.keyCode === 13 ? actions.addTodo() : ''}
        />
      </Content>
    </Wrapper>
  )
}

export const main = app(state, actions, view, document.body)
