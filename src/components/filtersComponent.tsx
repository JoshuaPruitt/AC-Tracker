import { IoIosArrowDown } from "react-icons/io";
import { useState, useEffect } from "react"

export const FilterComponent = () => {
    const [filter, setFilter] = useState({
        timed: true,
        bugs: true,
        fish: true,
        seaCreatures: true,
        total: false,
        uncatagorized: false,
        selectedItems: false
    });

    const [isOpen, setIsOpen] = useState(false);

    const filterHtml = () => {
        return (
        <div className=" bg-zinc-950 dark:bg-purple-950 rounded-lg p-4 w-1/3 shadow-lg max-w-50 static">
            <div className='flex justify-between' onClick={() => setIsOpen(!isOpen)}>
                <button 
                    type="button" 
                    className="flex justify-between items-center bg-zinc-700 text-white dark:bg-purple-800 rounded-md px-4 py-2 cursor-pointer" 
                    id="menu-button"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    Filters
                </button>

                <IoIosArrowDown width={30} height={30} className="text-gray-600 scale-120 translate-y-1.5"/>
            </div>
            

            {isOpen ? 
                <div className="space-y-2">
                    <div className="py-1">
                        {Object.keys(filter).map((value, index) => (
                            <label key={index} className="text-white flex items-center space-x-2">
                                <input 
                                    type="checkbox"
                                    checked={filter[value as keyof typeof filter]}
                                    onChange={() => setFilter((prev) => ({
                                        ...prev, 
                                        [value]: !prev[value as keyof typeof filter]
                                    }))} 
                                    className="mr-2"
                                />
                                {value}
                                {/* {key.charAt(0).toUpperCase() + key.slice(1)} */}
                            </label>
                        ))}
                    </div>
                </div> : ''
            }
        </div>
    )}

    useEffect(() => {
        console.log(filter)
    }, [filter]);

    return {filter, filterHtml}
}