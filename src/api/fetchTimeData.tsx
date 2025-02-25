import { useState, useEffect } from "react";
import axios from "axios";
import Time from "../interfaces/time-interface";

const GetTimeData = () => {
    const [currentTime, setCurrentTime] = useState<Time| null>();
    const [ip, setIpAddress] = useState<string | null>();
    // const [timerActive, setTimerActive] = useState<boolean>(false);

    const getIpData = async () => {
        const res = await axios.get('https://api.ipify.org/?format=json');
        console.log("Ip address:", res.data.ip)
        setIpAddress(res.data.ip)

        return res.data.ip;
    };

    // const timer = () => {
    //     setInterval(() => {
    //         addToTime()
    //         setTimerActive(false)
    //     } , 1000)
    // }

    // const addToTime = () => {
    //     if(currentTime){

    //         if(currentTime.seconds == 60){
    //             setCurrentTime({...currentTime, minute: currentTime.minute++, seconds: 0})
    //             console.log("New Minute")
    //         } else {
    //             setCurrentTime({...currentTime, seconds: currentTime.seconds++})
    //         }

    //         timer()
    //     } else {
    //         console.log("No Current Time!")
    //     }
    // }

    const fetchData = async (retIp?: string | null) => {
        if (retIp){
            const requestLink = `https://timeapi.io/api/time/current/ip?ipAddress=${retIp}`;
            const res = await axios.get(requestLink);

            console.log("Time:", res.data);
            setCurrentTime(res.data);
        } else {
            const requestLink = `https://timeapi.io/api/time/current/ip?ipAddress=${ip}`;
            const res = await axios.get(requestLink);

            console.log("Time:", res.data);
            setCurrentTime(res.data);
        }
    }

    // useEffect(() => {
    //     if(!timerActive){
    //         timer()
    //         setTimerActive(true)
    //     }

    // }, [currentTime])

    useEffect(() => {
        const checkIfIp = async () => {
            if(!ip){ //if no ip address then grap ip
                const ip = await getIpData();
                await fetchData(ip)
            }
        }

        checkIfIp()
    }, [])

    return (
        <div>
            {ip && currentTime ? 
                <div>
                    <h3>{ip}</h3>
                    <h4>{`Time: ${currentTime?.minute}:${currentTime?.seconds}:${currentTime?.milliSeconds}`}</h4>
                </div> 
                : 
                ""
            }
        </div>
    )
}

export default GetTimeData;