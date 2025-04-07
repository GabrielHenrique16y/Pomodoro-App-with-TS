import { JSX, useEffect, useState, useCallback } from "react";
import { useInterval } from "../hooks/use-interval";
import { Timer } from "./timer";
import { Button } from "./button";

import bell_start from '../sounds/bell-start.mp3';
import bell_finish from '../sounds/bell-finish.mp3';
import { secondsToTime } from "../utils/secondsToTime";

interface Props {
    pomodoroTime: number;
    shortRestTime: number;
    longRestTime: number;
    cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element{
    const [mainTime, setMainTime] = useState(props.pomodoroTime);
    const [timeCounting, setTimeCounting] = useState(false);
    const [working, setWorking] = useState(false);
    const [resting, setResting] = useState(false);

    const [cyclesQntManager, setCyclesQntManager] = useState(new Array(props.cycles - 1).fill(true));

    const [completedCycles, setCompletedCycles] = useState(0);
    const [fullWorkingTime, setFullWorkingTime] = useState(0);
    const [numberOfPomodoros, setNumberOfPomodoros] = useState(0);

    const workingStartSound = new Audio(bell_start);
    const workingStopSound = new Audio(bell_finish);

    useInterval(() => {
        setMainTime(mainTime - 1);
        if(working) setFullWorkingTime(fullWorkingTime + 1)
    }, timeCounting ? 1000 : null)

    const configureWork = useCallback(() => {
        setTimeCounting(true);
        setWorking(true);
        setResting(false);
        setMainTime(props.pomodoroTime);
        workingStartSound.play();
    }, [props.pomodoroTime, workingStartSound])

    const configureRest = useCallback((Long: boolean) => {
        setTimeCounting(true);
        setWorking(false);
        setResting(true);
        if(Long){
            setMainTime(props.longRestTime);
        }else{
            setMainTime(props.shortRestTime);
        }
        workingStopSound.play();
    }, [props.longRestTime, props.shortRestTime, workingStopSound])

    useEffect(() => {
        if(working) document.body.classList.add('working');
        if(resting) document.body.classList.remove('working');

        if(mainTime > 0) return

        if(working && cyclesQntManager.length > 0){
            configureRest(false);
            cyclesQntManager.pop();
        }else if(working && cyclesQntManager.length <= 0){
            configureRest(true);
            setCyclesQntManager(new Array(props.cycles - 1).fill(true))
            setCompletedCycles(completedCycles + 1)
        }

        if(working) setNumberOfPomodoros(numberOfPomodoros + 1);
        if(resting) configureWork()
    }, [working, resting, cyclesQntManager, mainTime, props.cycles, completedCycles, configureRest, configureWork, numberOfPomodoros])

    return ( 
        <div className="pomodoro">
            <h2>You are: Working</h2>
            <Timer mainTime={mainTime}/>
            <div className="display_buttons">
                <Button text={working ? 'Reset' : 'Work'} onClick={() => configureWork()} className="work_btn"/>
                <Button text="Rest" className="resting_btn" onClick={() => configureRest(false)}/>
                <Button text={timeCounting ? 'Pause' : 'Play'} onClick={() => setTimeCounting(!timeCounting)} className={!working && !resting ? 'hidden' : ''}/>
            </div>
            <div className="details">
                <p>Ciclos concluidos: {completedCycles}</p>
                <p>Horas trabalhadas: {secondsToTime(fullWorkingTime)}</p>
                <p>Pomodoros concluidos: {numberOfPomodoros}</p>
            </div>
        </div>
    )
}