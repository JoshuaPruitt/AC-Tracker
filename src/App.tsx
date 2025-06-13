// import { ChangeTheme } from "./components/pageThemeChange";
import DisplayIcons from "./components/displayIcons";
// import grass_bg from "../assets/background/grass_bg.jpg";
import './App.css'

function App() {
  // const {isDark, toggleDarkMode} = ChangeTheme();

  return (
    <div className="bg-[url('../assets/background/grass_bg_2_rotate.png')] bg-cover grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className='flex justify-center text-white'>
          <h1 className='font-bold text-xl bg-emerald-800 rounded-lg p-1.5'>Animal Crossing Tracker</h1>
      </div>

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">

        {/* <div className="flex">
          <button 
            onClick={() => toggleDarkMode()}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800"
            >
              {isDark ? "🌙" : "☀️"}
          </button>
        </div> */}

        <div>
          <DisplayIcons/>
        </div>
      </main>
    </div>
  );
}

export default App
