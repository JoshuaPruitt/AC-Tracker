/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, useEffect } from "react";
import { useEffect, useState } from "react";
import { Acnh_data_interface } from "../interfaces/acnh-data-interface.js";
import { acnh_data } from "../data/acnh-data.js";


export default function DisplayIcons() {
    const filePaths: Acnh_data_interface[] = acnh_data;

    const [bugs, setBugs] = useState<any>([]);
    const [fish, setFish] = useState<any>([]);
    const [seaCreatures, setSeaCreatures] = useState<any>([]);
    const [uncatagorized, setUncatagorized] = useState<any>([]);

    const filterData = () => {
        for (const item in filePaths){
            
            if (filePaths[item].type === 1){
                setBugs((previousItems: any) => [...previousItems, filePaths[item]])
            } else if (filePaths[item].type === 2){
                setFish((previousItems: any) => [...previousItems, filePaths[item]])
            } else if (filePaths[item].type === 3){
                setSeaCreatures((previousItems: any) => [...previousItems, filePaths[item]])
            } else {
                setUncatagorized((previousItems: any) => [...previousItems, filePaths[item]])
            }
        }
    }

    useEffect(() => {
        filterData()
        console.log("bugs:", bugs)
        console.log("fish:", fish)
        console.log("sea creatures:", seaCreatures)
    }, [])

    return (
        <div>
            <div>
                <h2>Bugs</h2>
                {   
                    bugs.map((file: any, index: number) => {
                            return (
                                <button key={index}>
                                    <img 
                                        src={file.icon}
                                        alt={file.name}
                                        />
                                </button>
                            )
                        })
                    }
            </div>
            <div>
                <h2>Fish</h2>
                    {   
                        fish.map((file: any, index: number) => {
                            return (
                               <button key={index}>
                                    <img 
                                        src={file.icon}
                                        alt={file.name}
                                        />
                                </button>
                            )
                        })
                    }
            </div>
            <div>
                <h2>Sea Creatures</h2>
                    {   
                        seaCreatures.map((file: any, index: number) => {
                            return (
                                <button key={index}>
                                    <img 
                                        src={file.icon}
                                        alt={file.name}
                                        />
                                </button>
                            )
                        })
                    }
            </div>
            <div>
                <h2>Uncatagorized</h2>
                    {   
                        uncatagorized.map((file: any, index: number) => {
                            return (
                                <button key={index}>
                                    <img 
                                        src={file.icon}
                                        alt={file.name}
                                        />
                                </button>
                            )
                        })
                    }
            </div>
        </div>
    )
}