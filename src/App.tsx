import { JSX } from 'react'
import { PomodoroTimer } from './components/pomodoroTimer'
import './index.css'

function App(): JSX.Element {

  return <div className='container'>
    <PomodoroTimer pomodoroTime={1500} longRestTime={900} shortRestTime={300} cycles={4}/>
  </div>
}

export default App
