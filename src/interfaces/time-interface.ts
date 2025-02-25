// time interface used to judge the shape of the data from the time api
interface Time {
    year: number,
    month: number,
    day: number,
    hour: number, 
    minute: number,
    seconds: number, 
    milliSeconds: number,

    date?: string,
    dayOfWeek?: string,
    dstActive?: boolean,
    timeZone?: string
}

export default Time;