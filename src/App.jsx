import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/queryClient";
import { GlobalContextProvider } from "./context/GlobalContext";
import ErrorBoundary from "./components/ErrorBoundary";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

// Landing Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import TransientPage from "./pages/Transient/TransientPage"
import TransientForm from "./pages/Transient/TransientForm"

// Student Pages
import StudentPage from "./pages/Student/StudentPage";
import StudentInfo from "./pages/Student/Student Info/StudentInfo";

// Admin Pages
import AdminPage from "./pages/Admin/AdminPage";
import AdminPage_overstayPermits from "./pages/Admin/subPages/AdminPage_overstayPermits";
import AdminPage_editOffenses from "./pages/Admin/subPages/AdminPage_editOffenses";
import AdminPage_studentsArchive from "./pages/Admin/subPages/AdminPage_studentsArchive";
import AdminPage_studentsPayments from "./pages/Admin/subPages/AdminPage_studentsPayments";
import AdminPage_transientRequests from "./pages/Admin/subPages/AdminPage_transientRequests";
import AdminPage_editRoles from "./pages/Admin/subPages/AdminPage_editRoles";
import AdminPage_studentsList from "./pages/Admin/subPages/AdminPage_studentsList";

// SignUp Pages
import NoUpdate from "./pages/SignUp/NoUpdate";
import PickRole from "./pages/SignUp/PickRole";
import StudentSignIn from "./pages/SignUp/StudentSignIn";

function App() {
  const [count, setCount] = useState(0);

  return (
    <QueryClientProvider client={queryClient}>
    <GlobalContextProvider>
    <ErrorBoundary>
    <Router>
      <Routes>
        {/* Landing Page and Login */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/transient" element={<TransientPage />}/>
        <Route path="/transient/transient-form" element={<TransientForm />}/>

        {/* Student Routes */}
        <Route path="/student/*" element={<StudentPage />} />
        <Route path="/student/student-info/*" element={<StudentInfo />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminPage />}>
          <Route index element={<AdminPage_overstayPermits />} />
          <Route path="editOffenses" element={<AdminPage_editOffenses />} />
          <Route path="overstayPermits" element={<AdminPage_overstayPermits />} />
          <Route path="studentsArchive" element={<AdminPage_studentsArchive />} />
          <Route path="studentsPayments" element={<AdminPage_studentsPayments />} />
          <Route path="transientRequests" element={<AdminPage_transientRequests />} />
          <Route path="editRoles" element={<AdminPage_editRoles/>} />
          <Route path="studentsList" element={<AdminPage_studentsList />} />
        </Route>

        {/* For Sign UP */}
        <Route path="NoUpdate" element={<NoUpdate />} />
        <Route path="PickRole" element={<PickRole/>} />
        <Route path="StudentSignIn" element={<StudentSignIn/>}/>

        {/* Catch-all route for unknown pages */}
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
    </ErrorBoundary>
    </GlobalContextProvider>
    </QueryClientProvider>
  );
}

export default App;
