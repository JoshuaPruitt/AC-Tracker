import { useState } from 'react';

export const ConfirmModal = (message: string, callbackFunction: (undefined)) => {
    const [showModal, setShowModal] = useState<boolean>(false)

    return (
        <div>
            <p>{message}</p>
            <button onClick={() => callbackFunction}>Yes</button>
        </div>
    )
}