/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useCallback, useEffect, useState } from "react";
import { get_data, save_data, remove_data } from "./localStorage.js";
import { Acnh_data_interface } from "../interfaces/acnh-data-interface.js";
import { acnh_data } from "../data/acnh-data.js";


import { getTimeDataIp } from '../api/timeData.js';
import Time from "../interfaces/time-interface.js";


export default function DisplayIcons() {
    const [filter, setFilter] = useState({
        timed: true,
        bugs: true,
        fish: true,
        seaCreatures: true,
        total: false,
        uncatagorized: false,
        selectedItems: false
    });

    const [iconDimensions, setIconDimensions] = useState<number>(40)

    const [hoveredItem, setHoveredItem] = useState<Acnh_data_interface | null>(null);
    const [clickedOnOnce, setClickedOn] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState(false)

    const filePaths: Acnh_data_interface[] = acnh_data;
    const [loading, setLoading] = useState<boolean>(true);

    const [total, setTotal] = useState<Acnh_data_interface[]>([]); // all items
    const [selectedItems, setSelectedItems] = useState<Acnh_data_interface[]>([]); // all selected items

    const [timedItems, setTimedItems] = useState<Acnh_data_interface[]>([]); // contains all items that are currently available at the time of day

    const [bugs, setBugs] = useState<any>([]); // bugs
    const [fish, setFish] = useState<any>([]); // fish
    const [seaCreatures, setSeaCreatures] = useState<any>([]); // sea creatures
    const [uncatagorized, setUncategorized] = useState<any>([]); // uncategorized


    const [currentTime, setCurrentTime] = useState<Time| null | void>(); // Current time

    const stopLoading = () => {
        setLoading(false);
    }

    const logSelectedItems = () => {
        console.log("selected Items:", selectedItems)
    }

    const pullStorage = () => {
        const data = get_data();
        if (!data) return;

        // Remove duplicates from incoming data before adding to selectedItems
        setSelectedItems((prevItems) => {
            const uniqueItems = [...prevItems, ...data].filter(
                (item, index, self) =>
                    index === self.findIndex((i) => i.name === item.name) // Ensure uniqueness
            );
            return uniqueItems;
        });
        
        // Add new unique items to total
        setTotal((prevTotal: any) => {
            const newItems = data.filter(
                (item: any) => !prevTotal.some((i: any) => i.name === item.name)
            );
    
            return [...prevTotal, ...newItems].filter(
                (item, index, self) =>
                    index === self.findIndex((i) => i.name === item.name) // Ensure uniqueness
            );
        });
    
        // Store indexes of selected items inside total
        setTotal((prevTotal: any) => {
            return prevTotal.filter(
                (item: any) => !data.some((selected: any) => selected.name === item.name)
            );
        });
    };

    const saveItems = () => {
        save_data(selectedItems)
    };

    // Memoize addData to prevent unnecessary re-creation
    const addData = useCallback(() => {
        setTotal((prevTotal) => [
            ...prevTotal,
            ...filePaths.filter(
                (item) => !prevTotal.some((i) => i.name === item.name)
            ),
        ]);
    }, [filePaths]); // Only updates when filePaths changes

    const removeTotalDup = () => {
        setTotal((prevTotal) =>
            prevTotal.filter((item, index, self) =>
                index === self.findIndex((i) => i.name === item.name)
            )
        );
    };
 
    const uniqueTimedItems = useMemo(() => {
        return total.filter(
            (item, index, self) =>
                index === self.findIndex((i) => i.name === item.name) // Ensure uniqueness
            //find items that starting time is less than the current time and ending time is more than the current time 
        ).filter(item => {
            //if statement prevents items with a starting time of a higher number than the ending time from not being added to current bugs
            if(item.time_of_day[0] < item.time_of_day[1]){
                return currentTime && item.time_of_day[0] <= currentTime.hour && item.time_of_day[1] >= currentTime.hour && currentTime.hour && item.month.north[currentTime.month] === 1 //Edit later to be based on hemisphere
            } else {
                return currentTime && item.time_of_day[1] <= currentTime.hour && item.time_of_day[0] >= currentTime.hour && currentTime.hour && item.month.north[currentTime.month] === 1
            }
        });
    }, [total, currentTime]);

    const addTotalItem = (item: Acnh_data_interface) => {
        setTotal((prevSelected) => {
            // Check if item already exists in selectedItems
            if (!prevSelected.some((i) => i.name === item.name)) {
                return [...prevSelected, item];
            } else {
                console.log("Duplicate", prevSelected)
                return prevSelected; // Return unchanged if it's a duplicate
            }
            
        });
    }

    const removeItemSelected = (item: Acnh_data_interface) => {
        setSelectedItems((prevTotal) => prevTotal.filter((i) => i.name !== item.name));
    }

    const selectAlreadySelected = (item: Acnh_data_interface) => {
        removeItemSelected(item) // remove item from selected
        addTotalItem(item) // add item to total

        setItems() // refresh categories
    }

    const addSelectedItem = (item: Acnh_data_interface) => {
        setSelectedItems((prevSelected) => {
            // Check if item already exists in selectedItems
            if (!prevSelected.some((i) => i.name === item.name)) {
                return [...prevSelected, item];
            } else {
                console.log("Duplicate", prevSelected)
                return prevSelected; // Return unchanged if it's a duplicate
            }
            
        });
    }

    const removeItemTotal = (item: Acnh_data_interface) => {
        setTotal((prevTotal) => prevTotal.filter((i) => i.name !== item.name));
    };

    const clickOnItem = (item: Acnh_data_interface) => {
        if(!clickedOnOnce){
            setHoveredItem(item)
            setClickedOn(true)
        } else if (clickedOnOnce && item == hoveredItem){
            setHoveredItem(null)
            selectItem(item)
            setClickedOn(false)
        } else if (clickedOnOnce && item != hoveredItem){
            setHoveredItem(item)
        }
    }

    const selectItem = (item: Acnh_data_interface) => {
        removeItemTotal(item) // remove item from the total
        addSelectedItem(item) // add item to selected item
    }

    // Sets all items within the respective categories
    const setItems = useCallback(() => {
        setBugs(total.filter((item) => item.type === 1));
        setFish(total.filter((item) => item.type === 2));
        setSeaCreatures(total.filter((item) => item.type === 3));
        setUncategorized(total.filter((item) => item.type === 0));

        if (currentTime) {
            setTimedItems(total.filter(item => {
                //if statement prevents items with a starting time of a higher number than the ending time from not being added to current bugs
                if(item.time_of_day[0] < item.time_of_day[1]){
                    return currentTime && item.time_of_day[0] <= currentTime.hour && item.time_of_day[1] >= currentTime.hour && item.month.north[currentTime.month] === 1
                } else {
                    return currentTime && item.time_of_day[1] <= currentTime.hour && item.time_of_day[0] >= currentTime.hour && item.month.north[currentTime.month] === 1
                }
            }));
        };
    }, [total, currentTime]);//Oly recreates if total or currentTime changes

    // Function formats all selected Items data to be easier to read and understand. Adds month names, standard time, and weather information
    const setHoveredItemInformation = () => {
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

        const adapTime = setTime(hoveredItem?.time_of_day)
        const weather = setWeather(hoveredItem?.weather)

        if (hoveredItem?.type == 1){
            return (
                <div className={containerClass}>
                    <img src={hoveredItem.icon} alt={hoveredItem.name} width={iconDimensions} height={iconDimensions}></img>
                    <h3 className={fontClass}>{hoveredItem.name}</h3>
                    <p>Type: <span className={subFontClass}>{"Bug"}</span></p>
                    <p>Availability: <span className={subFontClass}>{setMonths(hoveredItem.month.north)}</span></p>
                    <p>Weather: <span className={subFontClass}>{weather}</span></p>
                    <p>Active Time: <span className={subFontClass}>{adapTime.join(" - ")}</span></p>
                    <p>Found: <span className={subFontClass}>{hoveredItem.bugLocation}</span></p>
                </div>
            )
        } else if (hoveredItem?.type == 2){
            return (
                <div className={containerClass}>
                    <img src={hoveredItem.icon} alt={hoveredItem.name} width={iconDimensions} height={iconDimensions}></img>
                    <h3 className={fontClass}>{hoveredItem.name}</h3>
                    <p>Type: <span className={subFontClass}>{"Fish"}</span></p>
                    <p>Availability: <span className={subFontClass}>{setMonths(hoveredItem.month.north)}</span></p>
                    <p>Weather: <span className={subFontClass}>{weather}</span></p>
                    <p>Active Time: <span className={subFontClass}>{adapTime.join(" - ")}</span></p>
                    <p>Found: <span className={subFontClass}>{hoveredItem.fishLocation}</span></p>
                </div>
            )
        } else if (hoveredItem?.type == 3){
            return (
                <div className={containerClass}>
                    <img src={hoveredItem.icon} alt={hoveredItem.name} width={iconDimensions} height={iconDimensions}></img>
                    <h3 className={fontClass}>{hoveredItem.name}</h3>
                    <p>Type: <span className={subFontClass}>{"Sea Creature"}</span></p>
                    <p>Availability: <span className={subFontClass}>{setMonths(hoveredItem.month.north)}</span></p>
                    <p>Active Time: <span className={subFontClass}>{adapTime.join(" - ")}</span></p>
                    <p>Sea Creature Shadow Size: <span className={subFontClass}>{hoveredItem.seaCreatureShadowSize}</span></p>
                    <p>Sea Creature Shadow Movement: <span className={subFontClass}>{hoveredItem.seaCreatureShadowMoveMent}</span></p>
                </div>
            )
        }
    }

    // set loading to true on start and once data is in then set loading to false
    useEffect(() => {
        try {
            const dataFunc = async () => {
                const timeData = await getTimeDataIp() // grab time data
                setCurrentTime(timeData) // set time data

                addData() // grab total data
                stopLoading() // stop loading state
            }

            dataFunc()
            
        } catch (err: any) {
            console.error("Error displaying elements!", err)
        }
    }, [addData]);

    useEffect(() => {
        console.log("total:", total)
        console.log("selected Items:", selectedItems)

        setItems() // set the items
        
    }, [total, selectedItems, setItems]);

    // remove total duplicates once the component has finished loading
    useEffect(() => {
        setLoading(true);
        pullStorage()
        removeTotalDup()
    
    }, []);

    // Ensures timedItems contains no duplicate entries
    useEffect(() => {
        setTimedItems(uniqueTimedItems)
    }, [uniqueTimedItems]);

    useEffect(() => {
        console.log(filter)
    }, [filter])

    return (
        <div>
            {loading ? <h2>Loading...</h2> : 
                <div onMouseLeave={() => setHoveredItem(null)}>
                    <div className=" bg-white rounded-lg p-4 w-1/3 shadow-lg max-w-50">
                        <button 
                            type="button" 
                            className="text-gray-600 hover:text-gray-800" 
                            id="menu-button"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            Filters
                        </button>

                        {isOpen ? 
                            <div className="space-y-2">
                                <div className="py-1">
                                    {Object.keys(filter).map((value, index) => (
                                        <label key={index} className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox"
                                                checked={filter[value as keyof typeof filter]}
                                                onChange={() => setFilter((prev) => ({
                                                    ...prev, 
                                                    [value]: !prev[value as keyof typeof filter]
                                                }))} 
                                                className="mr-2"
                                            />
                                            {value}
                                            {/* {key.charAt(0).toUpperCase() + key.slice(1)} */}
                                        </label>
                                    ))}
                                </div>
                            </div> : ''
                        }
                    </div>

                    <div>
                        {currentTime ? 
                            <div>
                                <h4 className="text-white">{`Current Time: ${currentTime?.hour}:${currentTime?.minute}:${currentTime?.seconds}`}</h4>
                                <h4 className="text-white">{`Month: ${currentTime.month}`}</h4>
                            </div> 
                            : 
                            ""
                        }
                    </div>

                    {/* Display enlarged info box when hovering */}
                    {hoveredItem && setHoveredItemInformation()}

                    <div className="inset-0 flex flex-wrap items-center justify-center bg-black bg-opacity-50 z-50 p-3 max-h-200 rounded-lg" >
                    {filter.timed ? 
                        <div className="flex flex-wrap justify-baseline mt-5">
                            <h2 className="text-white align-text-top">Timed Items</h2>
                            {
                                timedItems.map((item: any, index: number) => {
                                    return (
                                        <button 
                                            key={index} 
                                            onClick={() => clickOnItem(item)}
                                            className="transition-transform duration-200 ease-in-out hover:scale-125"
                                            >
                                            <img
                                                src={item.icon}
                                                alt={item.name}

                                                width={iconDimensions}
                                                height={iconDimensions}
                                            />
                                        </button>
                                    )
                                })
                            }
                        </div> : ""
                    }
                

                    {filter.bugs ? 
                            <div className="flex flex-wrap justify-baseline mt-5">
                                <h2 className="text-white align-text-top">Bugs</h2>
                                {
                                    bugs.map((item: any, index: number) => {
                                        return (
                                            <button 
                                                key={index} 
                                                onClick={() => clickOnItem(item)}
                                                className="transition-transform duration-200 ease-in-out hover:scale-125"
                                                >
                                                <img
                                                    src={item.icon}
                                                    alt={item.name}

                                                    width={iconDimensions}
                                                    height={iconDimensions}
                                                />
                                            </button>
                                        )
                                    })
                                }
                            </div>
                            :  ''
                    }
                    

                    {filter.fish ? 
                        <div className="flex flex-wrap justify-baseline mt-5">
                            <h2 className="text-white align-text-top">Fish</h2>
                            {
                                fish.map((item: any, index: number) => {
                                    return (
                                        <button 
                                                key={index} 
                                                onClick={() => clickOnItem(item)}
                                                className="transition-transform duration-200 ease-in-out hover:scale-125"
                                            >
                                            <img
                                                src={item.icon}
                                                alt={item.name}

                                                width={iconDimensions}
                                                height={iconDimensions}
                                            />
                                        </button>
                                    )
                                })
                            }
                        </div> : ''
                    }
                    
                    {filter.seaCreatures ? 
                        <div className="flex flex-wrap left-0 mt-5">
                            <h2 className="text-white align-text-top">Sea Creatures</h2>
                            {
                                seaCreatures.map((item: any, index: number) => {
                                    return (
                                        <button 
                                                key={index} 
                                                onClick={() => clickOnItem(item)}
                                                className="transition-transform duration-200 ease-in-out hover:scale-125"
                                            >
                                            <img
                                                src={item.icon}
                                                alt={item.name}
        
                                                width={iconDimensions}
                                                height={iconDimensions}
                                            />
                                        </button>
                                    )
                                })
                            }
                        </div> : ''
                    }

                    {filter.uncatagorized ? 
                        <div className="flex flex-wrap justify-baseline mt-5">
                            {uncatagorized ? <h2>Nothing in Uncategorized at this time...</h2> : 
                                <div>
                                    <h2 className="text-white align-text-top">Uncagegorized</h2>
                                    {
                                        seaCreatures.map((item: any, index: number) => {
                                            return (
                                                <button 
                                                    key={index} 
                                                    onClick={() => clickOnItem(item)}
                                                    className="transition-transform duration-200 ease-in-out hover:scale-125"
                                                >
                                                    <img
                                                        src={item.icon}
                                                        alt={item.name}
                
                                                        width={iconDimensions}
                                                        height={iconDimensions}
                                                    />
                                                </button>
                                            )
                                        })
                                    }
                                </div>
                            }
                        </div> : ''
                    }

                    {filter.total ? 
                        <div className="flex flex-wrap justify-baseline mt-5">
                            <h2 className="text-white align-text-top">Total</h2>
                            {
                                total.map((item: any, index: number) => {
                                    return (
                                        <button 
                                                key={index} 
                                                onClick={() => clickOnItem(item)}
                                                className="transition-transform duration-200 ease-in-out hover:scale-125"
                                            >
                                            <img
                                                src={item.icon}
                                                alt={item.name}

                                                width={iconDimensions}
                                                height={iconDimensions}
                                            />
                                        </button>
                                    )
                                })
                            }
                        </div> : ''
                    }

                    {filter.selectedItems ?  
                        <div className="flex flex-wrap justify-baseline mt-5">
                            <h2 className="text-white">Selected</h2>
                            {
                                selectedItems.map((item: any, index: number) => {
                                    return (
                                        <button 
                                            key={index} 
                                            onClick={() => selectAlreadySelected(item)}
                                            className="transition-transform duration-200 ease-in-out hover:scale-125"
                                            >
                                            <img
                                                src={item.icon}
                                                alt={item.name}

                                                width={iconDimensions}
                                                height={iconDimensions}
                                            />
                                        </button>
                                    )
                                })
                            }
                        </div> : ''
                    }

                </div>

                <div>
                    <button className=" bg-blue-100 rounded-lg p-2 shadow-lg m-2" onClick={() => saveItems()}>Save</button>
                    <button className=" bg-blue-50 rounded-lg p-2 shadow-lg m-2" onClick={() => logSelectedItems()}>log</button>
                    <button className=" bg-blue-50 rounded-lg p-2 shadow-lg m-2" onClick={() => remove_data()}>Clear Data</button>
                </div>

                <div>
                    <label>Icon Size: </label>
                    <input value={iconDimensions || ''} onChange={(e) => {
                        const {value} = e.target
                        setIconDimensions(Number(value))
                    }}></input>
                </div>
            </div>}
        </div>
    )
}