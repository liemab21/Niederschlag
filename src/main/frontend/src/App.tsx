import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PressureDashboard from "./components/WeatherAnalyticsDashboard.tsx";
import WeatherAnalyticsDashboard from "./components/WeatherAnalyticsDashboard.tsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <WeatherAnalyticsDashboard/>
    </>
  )
}

export default App
