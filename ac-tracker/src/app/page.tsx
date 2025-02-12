'use client'

import { useState, useEffect } from "react";
import { is_local_storage } from "./components/localStorage";
import FrontModal from "./pages/front";

export default function Home() {
  const [isModalOpen, setModalOpen] = useState(false)
  
  const openCloseModal = () => {
    if (isModalOpen == true) {
      setModalOpen(false)
    } else {
      setModalOpen(true)
    }
  };

  // Open the modal on first time opening page
  const firstTime = () => {
    if (is_local_storage() == false){
      openCloseModal()
    }
  };

  // Check if first time visiting page on visit
  useEffect(() => {
    firstTime()
  }, [])

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div>
          <button onClick={openCloseModal}>Open Modal</button>
        </div>
        <FrontModal 
          isOpen={isModalOpen}
          onClose={openCloseModal}
          />
      </main>
    </div>
  );
}
