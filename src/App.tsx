import { useState } from "react";
import TimeZoneModal from "./components/timeZoneModal";
import DisplayIcons from "./components/displayIcons";
import './App.css'

function App() {
  const [isModalOpen, setModalOpen] = useState(false)
  
  const openCloseModal = () => {
    if (isModalOpen == true) {
      setModalOpen(false)
    } else {
      setModalOpen(true)
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h2 className="text-3xl font-bold underline">
          Hi world!
        </h2>

        <div>
          <button onClick={openCloseModal}>Open Modal</button>
        </div>
        <TimeZoneModal
          isOpen={isModalOpen}
          onClose={openCloseModal}
          />
        <div>
          <DisplayIcons/>
        </div>
      </main>
    </div>
  );
}

export default App
