import React from "react";
// This page will contain the first asking information. Only visible for first time users

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}


const FrontModal: React.FC<ModalProps> = ({isOpen, onClose}) => {
    // Ask the user their country so that we can accurately get the users time zone and hemisphere
    const [country, setCountry] = React.useState("")
    
    const handleSubmit = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div>
            <main>
                <label>Select Your Countr
                    <select onChange={e => setCountry(e.target.value)}>
                        <option value={"USA"}>United States</option>
                    </select>
                </label>

                <h2>Selected Country: {country}</h2>

                <button
                    className="submit bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
                     onClick={handleSubmit}
                >
                    Submit
                </button>
            </main>
        </div>
    )
}

export default FrontModal