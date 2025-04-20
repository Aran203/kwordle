import { useEffect, useState } from 'react'
import './index.css'

const BACKEND_URL = import.meta.env.VITE_API_URL

function App() {

    const [word, setWord] = useState<string>()

    const test = async() => {
        try {
            const response = await fetch(`${BACKEND_URL}/api`)
            if (!response.ok){
                const errorMessage = await response.text()
                throw new Error(errorMessage)
            }

            const data = await response.json()
            setWord(data)

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
      
        test()
      
    }, [])
    

    
    return (
    <div>
        <div className = "text-2xl font-extrabold text-center my-4">
            HELLO
        </div>

        <div className='text-xl text-blue-700 text-center my-96'>
            {word}
        </div>

    </div>
    )
}

export default App
