import { useState } from "react";
import { Acnh_data_interface } from "../interfaces/acnh-data-interface";
import { mouseCoord, getWindowSize } from "../App";

export const ClickItem = () => {
    const [clickedItem, setClickedItem] = useState<Acnh_data_interface | null>(null);
    const [clickedItemIconDim, setClickedIconDim] = useState(50)

    const setIconDim = (dim: number) => {
        setClickedIconDim(dim)
    }

    // Function formats all selected Items data to be easier to read and understand. Adds month names, standard time, and weather information
    const setClickedItemInformation = () => {
        let lowOrHigh: string;

        if ((getWindowSize().height / 2) > mouseCoord.mouseY){
            lowOrHigh = 'bottom-10'
        } else {
            lowOrHigh = 'top-10'
        }

        const containerClass = `fixed flex flex-wrap flex-col ${lowOrHigh} left-1/2 transform -translate-x-1/2 bg- p-4 bg-gray-700 shadow-lg rounded-lg z-50 w-[90vw] max-w-2xl text-white border-3 border-gray-800`;
        const fontClass = "text-[clamp(1rem,2vw,2rem)] font-semibold";
        const subFontClass = "text-blue-400";


        const setMonths = (months: number[]) => {
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            if (!months) return "";

            return months
                .map((val, i) => (val === 1 ? monthNames[i] : null))
                .filter(Boolean)
                .join(", ");
        };


        const setTime = (time: number[] | undefined) => {
            const retTime: string[] = [];

            if(!time){
                return ['', '']
            }

            for(let i = 0; i < time.length; i++){
                if(time[i] > 12){
                    retTime[i] = `${time[i] - 12}pm` 
                } else if(time[i] < 12){
                    retTime[i] = `${time[i]}am`
                }
            }
            return retTime
        }

        const setWeather = (weather: number | undefined) => {

            if (weather == 1){
                return 'All weather except rain'
            } else if (weather == 2){
                return "Only when raining"
            } else {
                return "Any Weather"
            }
        }

        const adapTime = setTime(clickedItem?.time_of_day)
        const weather = setWeather(clickedItem?.weather)

        if (clickedItem?.type == 1){
            return (
                <div className={containerClass}>
                    <img src={clickedItem.icon} alt={clickedItem.name} width={clickedItemIconDim} height={clickedItemIconDim}></img>
                    <h3 className={fontClass}>{clickedItem.name}</h3>
                    <p>Type: <span className={subFontClass}>{"Bug"}</span></p>
                    <p>Availability: <span className={subFontClass}>{setMonths(clickedItem.month.north)}</span></p>
                    <p>Weather: <span className={subFontClass}>{weather}</span></p>
                    <p>Active Time: <span className={subFontClass}>{adapTime.join(" - ")}</span></p>
                    <p>Found: <span className={subFontClass}>{clickedItem.bugLocation}</span></p>
                </div>
            )
        } else if (clickedItem?.type == 2){
            return (
                <div className={containerClass}>
                    <img src={clickedItem.icon} alt={clickedItem.name} width={clickedItemIconDim} height={clickedItemIconDim}></img>
                    <h3 className={fontClass}>{clickedItem.name}</h3>
                    <p>Type: <span className={subFontClass}>{"Fish"}</span></p>
                    <p>Availability: <span className={subFontClass}>{setMonths(clickedItem.month.north)}</span></p>
                    <p>Weather: <span className={subFontClass}>{weather}</span></p>
                    <p>Active Time: <span className={subFontClass}>{adapTime.join(" - ")}</span></p>
                    <p>Found: <span className={subFontClass}>{clickedItem.fishLocation}</span></p>
                </div>
            )
        } else if (clickedItem?.type == 3){
            return (
                <div className={containerClass}>
                    <img src={clickedItem.icon} alt={clickedItem.name} width={clickedItemIconDim} height={clickedItemIconDim}></img>
                    <h3 className={fontClass}>{clickedItem.name}</h3>
                    <p>Type: <span className={subFontClass}>{"Sea Creature"}</span></p>
                    <p>Availability: <span className={subFontClass}>{setMonths(clickedItem.month.north)}</span></p>
                    <p>Active Time: <span className={subFontClass}>{adapTime.join(" - ")}</span></p>
                    <p>Sea Creature Shadow Size: <span className={subFontClass}>{clickedItem.seaCreatureShadowSize}</span></p>
                    <p>Sea Creature Shadow Movement: <span className={subFontClass}>{clickedItem.seaCreatureShadowMoveMent}</span></p>
                </div>
            )
        }
    }

    return {clickedItem, setClickedItem, setClickedItemInformation, setIconDim}
}