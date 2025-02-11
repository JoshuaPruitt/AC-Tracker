import { useState } from "react"

// This page will contain the first asking information. Only visible for first time users
// export function is_local_Storage(){

// }

const Front = () => {
    // Ask the user their country so that we can accurately get the users time zone and hemisphere
    const [country, setCountry] = useState("")
    return (
        <div>
            <main>
                <label>Select Your Countr
                    <select onChange={e => setCountry(e.target.value)}>
                        <option value={"USA"}>United States</option>
                    </select>
                </label>

                <h2>Selected Country: {country}</h2>
            </main>
        </div>
    )
}

export default Front