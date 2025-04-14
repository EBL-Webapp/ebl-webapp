import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import supabase from "./supabase_client";
import LandingPage from "./pages/LandingPage";
import StudentPage from "./pages/StudentPage";
import AdminPage from "./pages/AdminPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/student/*" element={<StudentPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route 
          path="*" 
          element={
            <>
              <div>
                <a href="https://vite.dev" target="_blank">
                  <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                  <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
              </div>
              <h1>Vite + React</h1>
              <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                  count is {count}
                </button>
                <p>
                  Edit <code>src/App.jsx</code> and save to test HMR
                </p>
              </div>
              <p className="read-the-docs">
                Click on the Vite and React logos to learn more
              </p>
            </>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
