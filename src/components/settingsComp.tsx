import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

export const SettingsComponent = () => {
    const [settings, setSetting] = useState({
        iconSize: 40,
    })
    const [isSettingsOpen, setIsOpen] = useState(false);

    const settingsDropDown = () => {
        return (
        <div className=" bg-emerald-950 rounded-lg p-4 w-1/3 shadow-lg max-w-50 static">
            <div className='flex justify-between group' onClick={() => setIsOpen(!isSettingsOpen)}>
                <button 
                    type="button" 
                    className="group-hover:bg-teal-600 flex justify-between items-center bg-teal-700 text-white rounded-md px-4 py-2 cursor-pointer" 
                    id="menu-button"
                    onClick={() => setIsOpen(!isSettingsOpen)}
                >
                    Settings
                </button>

                <IoIosArrowDown width={30} height={30} className="ml-2 w-5 h-5 text-teal-600 group-hover:text-teal-500"/>
            </div>
            

            {isSettingsOpen ? 
                <div className="fixed inset-0 bg-gray-800/50 flex items-center justify-center z-20 flex-col">
                    <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-lg">
                        <div className="flex justify-center">
                            <h2>Settings</h2>
                        </div>

                        <div className="py-1 text-black">
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

                        <div className="m-1 flex justify-center">
                            <button className='btn text-white bg-emerald-900 p-1.5 rounded-lg' onClick={() => setIsOpen(false)}>Close</button>
                        </div>
                    </div>
                </div> : ''
            }
        </div>
        )
    }

    return {settings, settingsDropDown}
}