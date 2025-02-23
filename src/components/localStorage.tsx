import { Acnh_data_interface } from "../interfaces/acnh-data-interface"

// Check if there is data in the local storage
export const is_local_storage = () : boolean => {
    const storage = localStorage.getItem("ac_data")
    if (storage) {
        return true
    }
    return false
}

// Get the local storage data
export const get_data = () => {
    const storage: string | null = localStorage.getItem("ac_data")
    if (storage){
        console.log(storage)
        return JSON.parse(storage)
    } 
}

// Save data to local storage
export const save_data = (data: Acnh_data_interface[]) => {
    if (data){        
        localStorage.setItem("ac_data", JSON.stringify(data))
    }  
}