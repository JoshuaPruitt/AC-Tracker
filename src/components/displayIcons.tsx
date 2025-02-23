/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { get_data, save_data } from "./localStorage.js";
import { Acnh_data_interface } from "../interfaces/acnh-data-interface.js";
import { acnh_data } from "../data/acnh-data.js";


export default function DisplayIcons() {
    const filePaths: Acnh_data_interface[] = acnh_data;
    const [loading, setLoading] = useState<boolean>(true);

    const [total, setTotal] = useState<any>([]); // all items
    const [selectedItems, setSelectedItems] = useState<any>([]); // all selected items
    // const [bugs, setBugs] = useState<any>([]); // bugs
    // const [fish, setFish] = useState<any>([]); // fish
    // const [seaCreatures, setSeaCreatures] = useState<any>([]); // sea creatures
    // const [uncatagorized, setUncatagorized] = useState<any>([]); // uncategorized

    const logSelectedItems = () => {
        console.log("selected Items:", selectedItems)
    }

    // const pullStorage = () => {
    //     const data = get_data()

    //     for (const item in data){
    //         if (!selectedItems.find((i: any) => i.name === data[item].name)){
    //             setSelectedItems((previousItems: any) => [...previousItems, data[item]]) // set selected items
    //         };
                
    //         if (!total.find((i: any) => i.name === data[item].name)){
    //             console.log("Found Item!", data[item].name)
    //             // setTotal(total.filter((i: any) => i.name == data[item].name));
    //         };
    //     };
    // };

    const pullStorage = () => {
        const data = get_data();

        if (!data) return;
    
        // Add new unique items to total
        const newItems = data.filter(
            (item: any) => !total.some((i: any) => i.name === item.name)
        );
    
        if (newItems.length > 0) {
            setTotal((prevTotal: any) => {
                // Remove items that exist in selectedItems
                const uniqueTotal = [...prevTotal, ...newItems]
                    .filter(
                        (item, index, self) =>
                            index === self.findIndex((i) => i.name === item.name) // Ensure uniqueness
                    )
                    .filter((item) => !selectedItems.some((selected: any) => selected.name === item.name)); // Exclude selected items
    
                return uniqueTotal;
            });
        }
    
        // Store indexes of selected items inside total
        const uniqueSelectedIndexes = data
            .map((item: any) => total.findIndex((i: any) => i.name === item.name)) // Find indexes of selected items in total
            .filter((index: number) => index !== -1); // Remove items not found
    
        if (uniqueSelectedIndexes.length > 0) {
            console.log("unique selected Indexes", uniqueSelectedIndexes)
            for(const index in uniqueSelectedIndexes){
                console.log("Current index", uniqueSelectedIndexes[index])
                removeItemTotal(uniqueSelectedIndexes[index]); // Pass indexes to removeItem function
            }
            
        }
    };
    

    const saveItems = () => {
        save_data(selectedItems)
    };

    const addData = async () => {
        for (const item in filePaths){
            // if item does not already exist in total then add to total
            if (!total.find((i: any) => i.name === total[item].name)){
                setTotal((previousItems: any) => [...previousItems, filePaths[item]])
            }
        }
    };

    const removeDup = async () => {
        for (const item in filePaths){
            // if item does not already exist in total then add to total
            if (!total.find((i: any) => i.name === total[item].name)){
                setTotal(total.filter((_: any, i: any) => i !== item))
            }
        }
    };

    const selectItem = (index: number) => {
        addSelectedItem(index)
        removeItemTotal(index)
    }

    const addSelectedItem = (index: number) => {
        const item = total[index];
        setSelectedItems((previousItems: any) => [...previousItems, item])
    }

    const removeItemTotal = (index: number) => {
        console.log("Remove index", index)
        const item = total[index];
        console.log("Remove Item", item)
        setTotal(total.filter((_: any, i: any) => i !== index)); // remove item from total
        // setSelectedItems((previousItems: any) => [...previousItems, item])
    };

    useEffect(() => {
        console.log("total:", total)
        console.log("selected Items:", selectedItems)
    }, [total, selectedItems]);

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
            <div>
                <h2>Total</h2>
                {
                    loading ? <h2>loading...</h2> : total.map((item: any, index: number) => {
                        return (
                            <button key={index} onClick={() => selectItem(index)}>
                                <img
                                    src={item.icon}
                                    alt={item.name}
                                />
                            </button>
                        )
                    })
                }
            </div>

            <div>
                <button onClick={() => saveItems()}>Save</button>
                <button onClick={() => logSelectedItems()}>log</button>
            </div>
        </div>
    )
}