import { Provider } from 'react-redux'
import './App.css'
import store from './store/store'
import { router } from './router'
import { RouterProvider } from 'react-router'

function App() {

  return (
    <>

      <Provider store={store}>

        <RouterProvider router={router} />

      </Provider>
    </>
  )
}

export default App
