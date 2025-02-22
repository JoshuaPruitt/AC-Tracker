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
        console.log(selectedItems)
    }

    const pullStorage = () => {
        const data = get_data()
        setSelectedItems((previousItems: any) => [...previousItems, ...data]) // set selected items
        for (const item in data){
            if (!total.find((i: any) => i.name === data[item].name)){
                setTotal(total.filter((_: any, i: any) => i !== item));
            };
        };
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

    const removeItem = (index: number) => {
        const item = total[index];
        setTotal(total.filter((_: any, i: any) => i !== index)); // remove item from total
        setSelectedItems((previousItems: any) => [...previousItems, item])
    };

    useEffect(() => {
        console.log(total)
        console.log(selectedItems)
    }, [total, selectedItems]);

    // remove any duplicates once the component has finished loading
    useEffect(() => {
        removeDup()
        pullStorage()

        // filter any null values
        setSelectedItems(selectedItems.filter((item: any) => item))
    
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
                            <button key={index} onClick={() => removeItem(index)}>
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