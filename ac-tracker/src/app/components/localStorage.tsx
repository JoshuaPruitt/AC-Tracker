
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
    const storage = localStorage.getItem("ac_data")
    return storage
}

// Save data to local storage
export const save_data = (data: string) => {
    localStorage.setItem("ac_data", data)
}