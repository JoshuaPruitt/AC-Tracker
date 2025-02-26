/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useCallback, useEffect, useState } from "react";
import { get_data, save_data, remove_data } from "./localStorage.js";
import { Acnh_data_interface } from "../interfaces/acnh-data-interface.js";
import { acnh_data } from "../data/acnh-data.js";

import { getTimeDataIp } from '../api/timeData.js';
import Time from "../interfaces/time-interface.js";


export default function DisplayIcons() {
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
        ).filter(item => currentTime && item.time_of_day >= currentTime.hour);
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
            setTimedItems(total.filter((item) => item.time_of_day >= currentTime.hour));
        }
    }, [total, currentTime]); // Only recreates if total or currentTime changes

    // set loading to true on start and once data is in then set loading to false
    useEffect(() => {
        setLoading(true);
        try {
            const dataFunc = async () => {
                const timeData = await getTimeDataIp() // grab time data
                setCurrentTime(timeData) // set time data

                addData() // grab total data
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
        stopLoading() // stop loading state
        
    }, [total, selectedItems, setItems]);

    // remove total duplicates once the component has finished loading
    useEffect(() => {
        pullStorage()
        removeTotalDup()
    
    }, [loading]);

    // Ensures timedItems contains no duplicate entries
    useEffect(() => {
        setTimedItems(uniqueTimedItems)
    }, [uniqueTimedItems]);

    return (
        <div>
            {loading ? <h2>Loading...</h2> : 
            <div>
                <div>
                    {currentTime ? 
                        <div>
                            <h4>{`Time: ${currentTime?.hour}:${currentTime?.minute}:${currentTime?.seconds}`}</h4>
                        </div> 
                        : 
                        ""
                    }
                </div>

                <div>
                    <h2>Items available at this time</h2>
                    {
                        timedItems.map((item: any, index: number) => {
                            return (
                                <button key={index} onClick={() => selectItem(item)}>
                                    <img
                                        src={item.icon}
                                        alt={item.name}

                                        width={30}
                                        height={30}
                                    />
                                </button>
                            )
                        })
                    }
                </div>

                <div>
                    <h2>Bugs</h2>
                    {
                        bugs.map((item: any, index: number) => {
                            return (
                                <button key={index} onClick={() => selectItem(item)}>
                                    <img
                                        src={item.icon}
                                        alt={item.name}

                                        width={30}
                                        height={30}
                                    />
                                </button>
                            )
                        })
                    }
                </div>

                <div>
                    <h2>Fish</h2>
                    {
                        fish.map((item: any, index: number) => {
                            return (
                                <button key={index} onClick={() => selectItem(item)}>
                                    <img
                                        src={item.icon}
                                        alt={item.name}

                                        width={30}
                                        height={30}
                                    />
                                </button>
                            )
                        })
                    }
                </div>

                <div>
                    <h2>Sea Creatures</h2>
                    {
                        seaCreatures.map((item: any, index: number) => {
                            return (
                                <button key={index} onClick={() => selectItem(item)}>
                                    <img
                                        src={item.icon}
                                        alt={item.name}

                                        width={30}
                                        height={30}
                                    />
                                </button>
                            )
                        })
                    }
                </div>

                {uncatagorized ? "" : 
                <div>
                    <h2>Uncagegorized</h2>
                    {
                        seaCreatures.map((item: any, index: number) => {
                            return (
                                <button key={index} onClick={() => selectItem(item)}>
                                    <img
                                        src={item.icon}
                                        alt={item.name}

                                        width={30}
                                        height={30}
                                    />
                                </button>
                            )
                        })
                    }
                </div>
                }

                <div>
                    <h2>Total</h2>
                    {
                        total.map((item: any, index: number) => {
                            return (
                                <button key={index} onClick={() => selectItem(item)}>
                                    <img
                                        src={item.icon}
                                        alt={item.name}

                                        width={30}
                                        height={30}
                                    />
                                </button>
                            )
                        })
                    }
                </div>

                <div>
                    <h2>Selected</h2>
                    {
                        selectedItems.map((item: any, index: number) => {
                            return (
                                <button key={index} onClick={() => selectAlreadySelected(item)}>
                                    <img
                                        src={item.icon}
                                        alt={item.name}

                                        width={30}
                                        height={30}
                                    />
                                </button>
                            )
                        })
                    }
                </div>

                <div>
                    <button onClick={() => saveItems()}>Save</button>
                    <button onClick={() => logSelectedItems()}>log</button>
                    <button onClick={() => remove_data()}>Clear Data</button>
                </div>
            </div>}
        </div>
    )
}