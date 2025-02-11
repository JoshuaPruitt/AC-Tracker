
// Check if there is data in the local storage
export const is_local_storage = () : boolean => {
    const storage = localStorage.getItem("ac_data")
    if (storage) {
        return true
    }
    return false
}