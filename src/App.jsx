import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DataTable from './components/DataTable'
import MergedUserPage from './components/MergedUserPage' 

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DataTable />}/>
        <Route path="/merged-user" element={<MergedUserPage />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
