import Offenses from "./components/Offenses";
import StudentData from "./components/StudentData";
import ChargeSlip from "./components/ChargeSlip";
import OvernightSlip from "./components/OvernightSlip";
import Header from '@/components/Header';
import VerticalNavbar from "./components/VerticalNavBar";
import Footer from '@/components/Footer';
import { useRedirect } from "../../redirect";
import { useEffect } from "react";

const StudentPage = () => {

  const redirect = useRedirect();
  useEffect(() => {
    const runRedirect = async () => {
      await redirect("admin");
    };

    runRedirect();
  }, [redirect])

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header 
          variant="student" 
          isLoggedIn={true} 
          userName="Juan Dela Cruz" 
          userId="2021-12345" 
          onLogout={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        />
      </div>

      <div className="pt-15 sm:pt-20 flex flex-1"> {/* pt-20 = height of header */}
        {/* Fixed Sidebar */}
        <div className="fixed">
          <VerticalNavbar />
        </div>

        {/* Scrollable Main Content */}
        <main className="flex-1 p-1 sm:p-6 overflow-y-auto bg-gray-50 ml-12 md:ml-54 transition-all duration-300">
          <div className="max-w-4xl w-full mx-auto px-3 sm:px-6 py-4">
          <div className="space-y-6 mt-4 mb-6">
          <div id="offenses" className="scroll-mt-26"><Offenses /></div>
          <div id="student-data" className="scroll-mt-26"><StudentData /></div>
          <div id="charge-slip" className="scroll-mt-26"><ChargeSlip /></div>
          <div id="overnight-slip" className="scroll-mt-26"><OvernightSlip /></div>
          </div>
          </div>
        </main> 
      </div>
      <Footer />
    </div>
  );
};

export default StudentPage;