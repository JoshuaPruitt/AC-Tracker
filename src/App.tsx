// import { ChangeTheme } from "./components/pageThemeChange";
import DisplayIcons from "./components/displayIcons";
// import grass_bg from "../assets/background/grass_bg.jpg";
import './App.css'

export const getWindowSize = () => {
  const {innerWidth: width, innerHeight: height} = window;
  return {
    width,
    height
  }
}

export let mouseCoord = {
  mouseX: 0,
  mouseY: 0
}

const mouseMove = (event: React.MouseEvent) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  mouseCoord = {
    mouseX: mouseX,
    mouseY: mouseY
  }

  console.log("Mouse Coordinates:");
  console.log("X:", mouseCoord.mouseX);
  console.log("Y:", mouseCoord.mouseY);
}

function App() {


  return (
    <div className="bg-[url('../assets/background/grass_bg_2_rotate.png')] bg-cover grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className='flex justify-center text-white'>
          <h1 className='font-bold text-xl bg-emerald-800 rounded-lg p-1.5'>Animal Crossing Tracker</h1>
      </div>

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start" onMouseMove={mouseMove}>

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
