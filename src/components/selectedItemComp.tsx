import { useState } from "react";
import { Acnh_data_interface } from "../interfaces/acnh-data-interface";

export const ClickItem = () => {
    const [clickedItem, setClickedItem] = useState<Acnh_data_interface | null>(null);
    const [clickedItemIconDim, setClickedIconDim] = useState(50)

    const setIconDim = (dim: number) => {
        setClickedIconDim(dim)
    }

    // Function formats all selected Items data to be easier to read and understand. Adds month names, standard time, and weather information
    const setClickedItemInformation = () => {
        const containerClass = 'fixed flex flex-wrap flex-col bottom-10 left-1/2 transform -translate-x-1/2 bg-white p-4 shadow-lg rounded-lg z-50 w-2xl';
        const fontClass = "text-lg font-semibold";
        const subFontClass = "text-blue-950";

        const setMonths = (months: number[]) => {
            if(months){
                let monthsActive: string = ''
                for(let i = 0; i < months.length; i++){
                    if(months[i] == 1 && i == 0){
                        monthsActive += " January,"
                    } else if(months[i] == 1 && i == 1){
                        monthsActive += " Febuary,"
                    } else if(months[i] == 1 && i == 2){
                        monthsActive += " March,"
                    } else if(months[i] == 1 && i == 3){
                        monthsActive += " April,"
                    } else if(months[i] == 1 && i == 4){
                        monthsActive += " May,"
                    } else if(months[i] == 1 && i == 5){
                        monthsActive += " June,"
                    }  else if(months[i] == 1 && i == 6){
                        monthsActive += " July,"
                    } else if(months[i] == 1 && i == 7){
                        monthsActive += " August,"
                    } else if(months[i] == 1 && i == 8){
                        monthsActive += " September,"
                    } else if(months[i] == 1 && i == 9){
                        monthsActive += " October,"
                    } else if(months[i] == 1 && i == 10){
                        monthsActive += " November,"
                    } else if(months[i] == 1 && i == 11){
                        monthsActive += " December"
                    }
                } 
                return monthsActive
            }
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