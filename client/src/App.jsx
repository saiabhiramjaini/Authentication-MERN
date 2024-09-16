import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import Home from "./pages/Home"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from './pages/ResetPassword'
import DashBoard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/signin' element={<Signin/>}></Route>
        <Route path='/forgotPassword' element={<ForgotPassword/>}></Route>
        <Route path='/resetPassword/:token' element={<ResetPassword/>}></Route>
        <Route path='/dashboard' element={<DashBoard/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
