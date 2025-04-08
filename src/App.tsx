import { JSX } from 'react'
import { PomodoroTimer } from './components/pomodoroTimer'
import './index.css'

function App(): JSX.Element {
  const pomodoroTime = localStorage.getItem('workingTime');
  const shortRestTime = localStorage.getItem('shortRestingTime');
  const longRestTime = localStorage.getItem('longRestingTime');

  return <div className='container'>
    <PomodoroTimer pomodoroTime={Number(pomodoroTime)} longRestTime={Number(longRestTime)} shortRestTime={Number(shortRestTime)} cycles={4}/>
  </div>
}

export default App
