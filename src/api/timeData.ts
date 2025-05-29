import axios from "axios";
import Time from "../interfaces/time-interface";

import errorTimeData from "../data/error-time-data";

const grapIp = async (): Promise<string> => {
    const requestLink = 'https://api.ipify.org/?format=json';

    try {
        const res = await axios.get(requestLink);
        return res.data.ip;
    } catch (err) {
        console.error("Unable to fetch ip adress!", err)
        return '';
    }
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

        console.error('Failed to fetch time data,', err) // send console error
        return errorTimeData; // return error data
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
