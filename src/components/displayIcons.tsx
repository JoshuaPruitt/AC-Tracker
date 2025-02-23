/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { get_data, save_data, remove_data } from "./localStorage.js";
import { Acnh_data_interface } from "../interfaces/acnh-data-interface.js";
import { acnh_data } from "../data/acnh-data.js";


export default function DisplayIcons() {
    const filePaths: Acnh_data_interface[] = acnh_data;
    const [loading, setLoading] = useState<boolean>(true);

    const [total, setTotal] = useState<Acnh_data_interface[]>([]); // all items
    const [selectedItems, setSelectedItems] = useState<Acnh_data_interface[]>([]); // all selected items

    const [bugs, setBugs] = useState<any>([]); // bugs
    const [fish, setFish] = useState<any>([]); // fish
    const [seaCreatures, setSeaCreatures] = useState<any>([]); // sea creatures
    const [uncatagorized, setUncategorized] = useState<any>([]); // uncategorized

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

    const addData = () => {
        for (const item in filePaths){
            // if item does not already exist in total then add to total
            if (!total.find((i: any) => i.name === total[item].name)){
                setTotal((previousItems: any) => [...previousItems, filePaths[item]])
            }
        }
    };

    const removeDup = () => {
        setTotal((prevTotal) =>
            prevTotal.filter((item, index, self) =>
                index === self.findIndex((i) => i.name === item.name)
            )
        );
    };

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
        // setSelectedItems((prevSelected) => [...prevSelected, item]);
        // const item = total[index];
        // setSelectedItems((previousItems: any) => [...previousItems, item])
    }

    const removeItemTotal = (item: Acnh_data_interface) => {
        setTotal((prevTotal) => prevTotal.filter((i) => i.name !== item.name));
        // setTotal((prevTotal) => prevTotal.filter((_, i) => i !== index));
    };

    const selectItem = (item: Acnh_data_interface) => {
        removeItemTotal(item) // remove item from the total
        addSelectedItem(item) // add item to selected item
    }

    const setItems = () => {
        setBugs(total.filter((item) => item.type === 1));
        setFish(total.filter((item) => item.type === 2));
        setSeaCreatures(total.filter((item) => item.type === 3));
        setUncategorized(total.filter((item) => item.type === 0));
    }

    useEffect(() => {
        console.log("total:", total)
        console.log("selected Items:", selectedItems)

        setItems() // set the items
    }, [total]);

    // remove any duplicates once the component has finished loading
    useEffect(() => {
        pullStorage()
        removeDup()

        // filter any null values
        // setSelectedItems(selectedItems.filter((item: any) => item))
    
    }, [loading]);

    // set loading to true on start and once data is in then set loading to false
    useEffect(() => {
        setLoading(true);
        try {
            addData()
            setLoading(false)
        } catch (err: any) {
            console.error("Error displaying elements!", err)
        }
    }, []);

    return (
        <div>
            {loading ? <h2>Loading...</h2> : 
            <div>
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