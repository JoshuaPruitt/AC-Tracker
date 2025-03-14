import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

export const SettingsComponent = () => {
    const [settings, setSetting] = useState({
        iconSize: 40,
    })
    const [isSettingsOpen, setIsOpen] = useState(false);

    const settingsDropDown = () => {
        return (
        <div className=" bg-white dark:bg-purple-950 rounded-lg p-4 w-1/3 shadow-lg max-w-50 static">
            <div className='flex justify-between' onClick={() => setIsOpen(!isSettingsOpen)}>
                <button 
                    type="button" 
                    className="flex justify-between items-center bg-gray-200 dark:bg-purple-800 rounded-md px-4 py-2 cursor-pointer" 
                    id="menu-button"
                    onClick={() => setIsOpen(!isSettingsOpen)}
                >
                    Settings
                </button>

                <IoIosArrowDown width={30} height={30} className="ml-2 w-5 h-5 text-gray-600 dark:text-white"/>
            </div>
            

            {isSettingsOpen ? 
                <div className="absolute mt-2 bg-white dark:bg-purple-950 rounded-lg p-4 shadow-lg z-50">
                    <div className="space-y-2">
                        <div className="py-1">
                            <label>Icon Size: 
                                <input value={settings.iconSize || ''} onChange={(e) => {
                                    const {value} = e.target
                                    setSetting((prev) => ({
                                        ...prev,
                                        iconSize: Number(value)
                                    }))
                                }}></input>
                            </label>
                        </div>
                    </div>
                </div> : ''
            }
        </div>
        )
    }

    return {settings, settingsDropDown}
}