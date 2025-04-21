import './index.css'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/Homepage'


function App() {

    return (
        <div> 
            <Navbar/>
            <div className='flex-grow'>
                <Routes>
                    <Route path = "/" element = {<HomePage/>} />
                </Routes>
            </div>
        </div>
    )
}

export default App
