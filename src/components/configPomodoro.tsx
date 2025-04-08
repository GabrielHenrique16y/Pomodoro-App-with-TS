import { JSX, useEffect, useState } from "react";
import { FaGear } from "react-icons/fa6";
import { timeTextToSeconds } from "../utils/timeTextToSeconds";
import { secondsToMinutes } from "../utils/secondsToMinutes";

export function ConfigPomodoro(): JSX.Element {
    const [working, setWorking] = useState("25:00");
    const [shortRest, setShortRest] = useState("05:00");
    const [longRest, setLongRest] = useState("15:00");

    useEffect(() => {
        const storedWorking = localStorage.getItem('workingTime');
        const storedShort = localStorage.getItem('shortRestingTime');
        const storedLong = localStorage.getItem('longRestingTime');

        if (storedWorking) setWorking(secondsToMinutes(Number(storedWorking)));
        else localStorage.setItem('workingTime', '1500');

        if (storedShort) setShortRest(secondsToMinutes(Number(storedShort)));
        else localStorage.setItem('shortRestingTime', '300');

        if (storedLong) setLongRest(secondsToMinutes(Number(storedLong)));
        else localStorage.setItem('longRestingTime', '900');
    }, []);

    const dropBtnFn = () => {
        const dropdownContent = document.getElementById('dropdown-content') as HTMLElement;
        dropdownContent.classList.toggle('show');
    }

    const workingTime = (e: any) => {
        setWorking(e.target.value);
        localStorage.setItem('workingTime', timeTextToSeconds(e.target.value).toString());
        localStorage.setItem('mainTime', timeTextToSeconds(e.target.value).toString());
        window.location.reload();
    }

    const shortRestingTime = (e: any) => {
        setShortRest(e.target.value);
        localStorage.setItem('shortRestingTime', timeTextToSeconds(e.target.value).toString());
        window.location.reload();
    }

    const longRestingTime = (e: any) => {
        setLongRest(e.target.value);
        localStorage.setItem('longRestingTime', timeTextToSeconds(e.target.value).toString());
        window.location.reload();
    }

    return (
        <div className="dropdown">
            <button className="dropbtn" onClick={dropBtnFn}>
                <FaGear />
            </button>
            <div className="dropdown-content" id="dropdown-content">
                <div className="inputControll">
                    <label htmlFor="">Tempo de trabalho: </label>
                    <input type="text" name="workingTime" onChange={(e) => setWorking(e.target.value)} onBlur={workingTime} value={working} placeholder="Ex: 25:00" />
                </div>
                <div className="inputControll">
                    <label htmlFor="">Tempo curto de descanso: </label>
                    <input type="text" name="shortRestingTime" onChange={(e) => setShortRest(e.target.value)} onBlur={shortRestingTime} value={shortRest} placeholder="Ex: 05:00" />
                </div>
                <div className="inputControll">
                    <label htmlFor="">Tempo longo de descanso: </label>
                    <input type="text" name="longRestingTime" onChange={(e) => setLongRest(e.target.value)} onBlur={longRestingTime} value={longRest} placeholder="Ex: 15:00" />
                </div>
            </div>
        </div>
    );
}
