import axios from "axios";
import Time from "../interfaces/time-interface";

const grapIp = async (): Promise<string> => {
    const res = await axios.get('https://api.ipify.org/?format=json');
    console.log("Ip address:", res.data.ip)

    return res.data.ip;
}

const fetchData = async (retIp: string | null): Promise<void | Time> => {
    if (retIp){
        const requestLink = `https://timeapi.io/api/time/current/ip?ipAddress=${retIp}`;
        const res = await axios.get(requestLink);

        console.log("Time:", res.data);
        return res.data // return the time data
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

export default {grapIp, fetchData, getTimeDataIp};
