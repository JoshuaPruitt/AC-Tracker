// import { useState } from "react";
// import TimeZoneModal from "./components/timeZoneModal";
import DisplayIcons from "./components/displayIcons";
import './App.css'

function App() {
  // const [isModalOpen, setModalOpen] = useState(false)
  
  // const openCloseModal = () => {
  //   if (isModalOpen == true) {
  //     setModalOpen(false)
  //   } else {
  //     setModalOpen(true)
  //   }
  // };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className='flex justify-center mt-5'>
          <h1 className='font-bold text-xl'>Animal Crossing Tracker</h1>
      </div>
      
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* <div>
          <button onClick={openCloseModal}>Open Modal</button>
        </div>
        <TimeZoneModal
          isOpen={isModalOpen}
          onClose={openCloseModal}
          /> */}
        <div>
          <DisplayIcons/>
        </div>
      </main>
    </div>
  );
}

export default App
