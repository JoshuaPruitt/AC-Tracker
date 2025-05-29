/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useCallback, useEffect, useState } from "react";
import { get_data, save_data, remove_data } from "./localStorage.js";
import { Acnh_data_interface } from "../interfaces/acnh-data-interface.js";
import { acnh_data } from "../data/acnh-data.js";

import { FilterComponent } from "./filtersComponent.js";
import { ClickItem } from "./selectedItemComp.js";
import { SettingsComponent } from "./settingsComp.js";

import { getTimeDataIp } from '../api/timeData.js';
import Time from "../interfaces/time-interface.js";

export default function DisplayIcons() {
    const {filter, filterHtml} = FilterComponent();
    const {settings, settingsDropDown} = SettingsComponent();
    const {clickedItem, setClickedItem, setClickedItemInformation} = ClickItem();

    const [clickedOnOnce, setClickedOn] = useState<boolean>(false);

    const filePaths: Acnh_data_interface[] = acnh_data;
    const skipLoad : boolean = false // used to skip loading screen
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
                // console.log("Duplicate", prevSelected)
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
                // console.log("Duplicate", prevSelected)
                return prevSelected; // Return unchanged if it's a duplicate
            }
            
        });
    }

    const removeItemTotal = (item: Acnh_data_interface) => {
        setTotal((prevTotal) => prevTotal.filter((i) => i.name !== item.name));
    };

    const clickOnItem = (item: Acnh_data_interface) => {
        if(!clickedOnOnce){
            setClickedItem(item)
            setClickedOn(true)
        } else if (clickedOnOnce && item == clickedItem){
            setClickedItem(null)
            selectItem(item)
            setClickedOn(false)
        } else if (clickedOnOnce && item != clickedItem){
            setClickedItem(item)
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
        // console.log("total:", total)
        // console.log("selected Items:", selectedItems)

        setItems() // set the items
        
    }, [total, selectedItems, setItems]);

    // remove total duplicates once the component has finished loading
    useEffect(() => {
        if (skipLoad){
            setLoading(false);
        } else {
            setLoading(true);
        }
        pullStorage()
        removeTotalDup()
    
    }, []);

    // Ensures timedItems contains no duplicate entries
    useEffect(() => {
        setTimedItems(uniqueTimedItems)
    }, [uniqueTimedItems]);

    // useEffect(() => {
    //     console.log(filter)
    // }, [filter])

    return (
        <div>
            {loading ? <h2>Loading...</h2> : 
                <div onMouseLeave={() => setClickedItem(null)}>
                    <div className="flex justify-between">
                        {filterHtml()}
                        {settingsDropDown()}
                    </div>
                    

                    <div>
                        {currentTime ? 
                            <div>
                                <h4 className="text-black dark:text-white">{`Current Time: ${currentTime?.hour}:${currentTime?.minute}:${currentTime?.seconds}`}</h4>
                                <h4 className="text-black dark:text-white">{`Month: ${currentTime.month}`}</h4>
                            </div> 
                            : 
                            ""
                        }
                    </div>

                    {/* Display enlarged info box when hovering */}
                    {clickedItem && setClickedItemInformation()}

                    <div className="inset-0 flex flex-wrap items-center justify-center bg-white dark:bg-black bg-opacity-50 z-50 p-3 max-h-200 rounded-lg shadow-lg" >
                    {filter.timed ? 
                        <div className="flex flex-wrap justify-baseline mt-5">
                            <h2 className="text-black dark:text-white align-text-top">Timed Items</h2>
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

                                                width={settings.iconSize}
                                                height={settings.iconSize}
                                            />
                                        </button>
                                    )
                                })
                            }
                        </div> : ""
                    }
                

                    {filter.bugs ? 
                            <div className="flex flex-wrap justify-baseline mt-5">
                                <h2 className="text-black dark:text-white align-text-top">Bugs</h2>
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

                                                    width={settings.iconSize}
                                                    height={settings.iconSize}
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
                            <h2 className="text-black dark:text-white align-text-top">Fish</h2>
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

                                                width={settings.iconSize}
                                                height={settings.iconSize}
                                            />
                                        </button>
                                    )
                                })
                            }
                        </div> : ''
                    }
                    
                    {filter.seaCreatures ? 
                        <div className="flex flex-wrap left-0 mt-5">
                            <h2 className="text-black dark:text-white align-text-top">Sea Creatures</h2>
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
        
                                                width={settings.iconSize}
                                                height={settings.iconSize}
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
                                    <h2 className="text-black dark:text-white align-text-top">Uncagegorized</h2>
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
                
                                                        width={settings.iconSize}
                                                        height={settings.iconSize}
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
                            <h2 className="text-black dark:text-white align-text-top">Total</h2>
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

                                                width={settings.iconSize}
                                                height={settings.iconSize}
                                            />
                                        </button>
                                    )
                                })
                            }
                        </div> : ''
                    }

                    {filter.selectedItems ?  
                        <div className="flex flex-wrap justify-baseline mt-5">
                            <h2 className="text-black dark:text-white align-text-top">Selected</h2>
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

                                                width={settings.iconSize}
                                                height={settings.iconSize}
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

            </div>}
        </div>
    )
}