import { Routes, Route } from "react-router-dom";
import DataPrivacy from "./SInfo-components/DataPrivacy";
import DormAccommodation from "./SInfo-components/DormAccommodation";
import Acknowledgement from "./SInfo-components/Acknowledgement";
import Header from '@/components/Header';
import SIVerticalNavbar from "./SInfo-components/SIVerticalNavBar";
import Footer from '@/components/Footer';

const StudentPage = () => {
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
          <SIVerticalNavbar />
        </div>

        {/* Scrollable Main Content */}
        <main className="flex-1 p-1 sm:p-6 overflow-y-auto bg-gray-50 ml-12 md:ml-54 transition-all duration-300">
          <div className="max-w-4xl w-full mx-auto px-3 sm:px-6 py-4">
            <div className="space-y-6 mt-4 mb-6">
              <div id="data-privacy" className="scroll-mt-26"><DataPrivacy /></div>
              <div id="dorm-accommodation" className="scroll-mt-26"><DormAccommodation /></div>
              <div id="acknowledgement" className="scroll-mt-26"><Acknowledgement /></div>
            </div>
          </div>
        </main> 
      </div>
      <Footer />
    </div>
  );
};

export default StudentPage;