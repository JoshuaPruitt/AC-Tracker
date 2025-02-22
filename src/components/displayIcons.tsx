/* eslint-disable @typescript-eslint/no-explicit-any */
import { Acnh_data_interface } from "../interfaces/acnh-data-interface.js";
import { acnh_data } from "../data/acnh-data.js";


export default function DisplayIcons() {
    const filePaths: Acnh_data_interface[] = acnh_data;

    return (
        <div>
            {   
                filePaths.map((file: any, index: number) => {
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
    )
}