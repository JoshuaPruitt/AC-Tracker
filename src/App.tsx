// import { ChangeTheme } from "./components/pageThemeChange";
import DisplayIcons from "./components/displayIcons";
import './App.css'

function App() {
  // const {isDark, toggleDarkMode} = ChangeTheme();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-slate-900 dark:bg-purple-950">
      <div className='flex justify-center text-white'>
          <h1 className='font-bold text-xl'>Animal Crossing Tracker</h1>
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
