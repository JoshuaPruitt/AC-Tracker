import axios from "axios";
import Time from "../interfaces/time-interface";

import errorTimeData from "../data/error-time-data";
import { timeDataError } from "../Handlers/error-handler";

const grapIp = async (): Promise<string> => {
    const res = await axios.get('https://api.ipify.org/?format=json');
    // console.log("Ip address:", res.data.ip)

    return res.data.ip;
}

const fetchData = async (retIp: string | null): Promise<void | Time> => {
    if (!retIp){ 
        return; // If no ip then return
    }

    const requestLink = `https://timeapi.io/api/time/current/ip?ipAddress=${retIp}`;

    try {

        const res = await axios.get(requestLink);
        return res.data;
    } catch (err){

        console.error('Failed to fetch time data,', err)
        timeDataError() // send error
        return errorTimeData;
    }
}

const getTimeDataIp = async (): Promise<void | Time> => {
    const ip =  await grapIp();
    const timeData: Time | void = await fetchData(ip)

    if(timeData){
        return timeData;
    } else {
        return console.error("Could not retrieve IP or Time Data!!")
    }
}

export {grapIp, fetchData, getTimeDataIp};
