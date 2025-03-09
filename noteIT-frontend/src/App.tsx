import { useState } from 'react'
import './App.css'
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Signup } from './pages/signup'
import { Signin } from './pages/Signin'
import { Dashboard } from './pages/dashboard'

function App() {
  const [count, setCount] = useState(0)

  const router = createBrowserRouter([
    {
      path:'/',
      element:<Signup/>
    },
    {
      path:'/signup',
      element:<Signup/>
    },
    {
      path:'/signin',
      element:<Signin/>

    },
    {
      path:'/dashboard',
      element:<Dashboard/>
    }
  ])

  return (
    <>
    <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
