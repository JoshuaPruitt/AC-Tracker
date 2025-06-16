import { Acnh_data_interface } from "../interfaces/acnh-data-interface"

// Check if there is data in the local storage
export const is_local_storage = () : boolean => {
    const storage = localStorage.getItem("ac_data")
    if (!storage) {
        return false
    } else {
        return true
    }
}

// Get the local storage data
export const get_data = () => {
    const storage: string | null = localStorage.getItem("ac_data")
    if (storage){
        // console.log(storage)
        return JSON.parse(storage)
    } 
}

// Save data to local storage
export const save_data = (data: Acnh_data_interface[]) => {
    if (data){        
        localStorage.setItem("ac_data", JSON.stringify(data))
    }  
}

// remove anything in local storage
export const remove_data = () => {
    localStorage.clear()
}

// Save page theme data
export const save_theme = (data: string | null) => {
    if(data){
        localStorage.setItem("theme", JSON.stringify(data))
    } else {
        remove_theme()
    }
}

// Get page theme data
export const get_theme = () => {
    const data: string | null = localStorage.getItem('theme')
    if(data){
        // console.log(data)
        return JSON.parse(data)
    }
}

export const remove_theme = () => {
    localStorage.removeItem('theme')
}