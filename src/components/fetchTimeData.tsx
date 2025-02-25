import { useState, useEffect } from "react";
import axios from "axios";
import Time from "../interfaces/time-interface";

const GetTimeData = () => {
    const [currentTime, setCurrentTime] = useState<Time| null>();
    const [ip, setIpAddress] = useState<string | null>();

    const getIpData = async () => {
        const res = await axios.get('https://api.ipify.org/?format=json');
        console.log("Ip address:", res.data.ip)
        setIpAddress(res.data.ip)
    };

    // const timer = () => {
    //     setInterval(fetchData, 1000)
    // }

    const fetchData = async () => {
        const requestLink = `https://timeapi.io/api/time/current/ip?ipAddress=${ip}`;
        const res = await axios.get(requestLink);

        console.log("Time:", res.data);
        setCurrentTime(res.data);
    }

    useEffect(() => {
        if(!ip){ //if no ip address then grap ip
            getIpData();
        }

        if(ip){
            fetchData();
        }

    }, [])

    return (
        <div>
            <div>
                <h3>{ip}</h3>
                <h4>{`Time: ${currentTime?.minute}:${currentTime?.seconds}:${currentTime?.milliSeconds}`}</h4>
            </div>
            
        </div>
    )
}

export default GetTimeData;