import { Provider } from 'react-redux'
import './App.css'
import store from './store/store'
import { router } from './router'
import { RouterProvider } from 'react-router'
import { NotificationProvider } from './hooks/useNotification'

function App() {

  return (
    <>

      <Provider store={store}>
        <NotificationProvider>

          <RouterProvider router={router} />
        </NotificationProvider>

      </Provider>
    </>
  )
}

export default App
