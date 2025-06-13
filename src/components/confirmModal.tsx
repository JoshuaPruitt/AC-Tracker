
interface ConfirmModalProps {
    message: string;
    callBackFunction: () => void;
    CloseFunction: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({message, callBackFunction, CloseFunction}) => {

    const onConfirm = () => {
        callBackFunction() // call the callback function
        CloseFunction() // call the close function
    };

    const onCancel = () => {
        CloseFunction() // call close function to close modal
    }

    return (
        <div className='fixed inset-0 bg-gray-800/50 flex items-center justify-center z-20'>
            <div className=" bg-white rounded-lg p-6 shadow-lg w-full max-w-4xl">
                <div>
                    <p>{message}</p>
                </div>

                <div>
                    <button onClick={() => onConfirm()} className="text-white btn rounded-lg bg-emerald-900 shadow-lg m-2 p-2">Yes</button>
                    <button onClick={() => onCancel()} className="text-white btn rounded-lg bg-emerald-900 shadow-lg m-2 p-2">No</button>
                </div>
            </div>
        </div> 
    )
}