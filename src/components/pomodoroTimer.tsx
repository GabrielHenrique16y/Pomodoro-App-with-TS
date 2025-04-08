import { JSX, useEffect, useState, useCallback } from "react";
import { useInterval } from "../hooks/use-interval";
import { Timer } from "./timer";
import { Button } from "./button";

import bell_start from '../sounds/bell-start.mp3';
import bell_finish from '../sounds/bell-finish.mp3';
import { secondsToTime } from "../utils/secondsToTime";
import { ConfigPomodoro } from "./configPomodoro";

interface Props {
    pomodoroTime: number;
    shortRestTime: number;
    longRestTime: number;
    cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element{
    const [mainTime, setMainTime] = useState(
        () => Number(localStorage.getItem('mainTime')) || props.pomodoroTime
    );    
    const [timeCounting, setTimeCounting] = useState(false);
    const [working, setWorking] = useState(false);
    const [resting, setResting] = useState(false);

    const [cyclesQntManager, setCyclesQntManager] = useState(new Array(props.cycles - 1).fill(true));

    const [completedCycles, setCompletedCycles] = useState(
        () => Number(localStorage.getItem('completedCycles')) || 0);
    const [fullWorkingTime, setFullWorkingTime] = useState(
        () => Number(localStorage.getItem('fullWorkingTime')) || 0);
    const [numberOfPomodoros, setNumberOfPomodoros] = useState(
        () => Number(localStorage.getItem('NumberOfPomodoro')) || 0);

    const workingStartSound = new Audio(bell_start);
    const workingStopSound = new Audio(bell_finish);

    const STORAGE_DATE_KEY = 'app_last_open_date';

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const lastOpenDate = localStorage.getItem(STORAGE_DATE_KEY);
        if (lastOpenDate !== today) {
            localStorage.clear();
            localStorage.setItem(STORAGE_DATE_KEY, today);
        
            setMainTime(props.pomodoroTime);
            setFullWorkingTime(0);
            setNumberOfPomodoros(0);
            setCompletedCycles(0);
            setCyclesQntManager(new Array(props.cycles - 1).fill(true));
            setTimeCounting(false);
            setWorking(false);
            setResting(false);
        }
    }, [props.pomodoroTime, props.cycles]);

    useInterval(() => {
        setMainTime(mainTime - 1);
        localStorage.setItem('mainTime', (mainTime - 1).toString());
        if(working) setFullWorkingTime(fullWorkingTime + 1)
        localStorage.setItem('fullWorkingTime', (fullWorkingTime + 1).toString());
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
            localStorage.setItem('completedCycles', (completedCycles + 1).toString())
        }

        if(working) {
            setNumberOfPomodoros(numberOfPomodoros + 1);
            localStorage.setItem('NumberOfPomodoro', (numberOfPomodoros + 1).toString())
        }
        if(resting) configureWork()
    }, [working, resting, cyclesQntManager, mainTime, props.cycles, completedCycles, configureRest, configureWork, numberOfPomodoros])

    return ( 
        <div className="pomodoro">
            <div className="pomodoroText">
                <h3><ConfigPomodoro /></h3>
                <h2>Você está: {working ? 'Trabalhando' : 'Descansando'}</h2>
            </div>
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