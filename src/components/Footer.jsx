import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#5a0000] text-white pt-6 pb-3 px-4 relative min-h-[280px] md:min-h-[300px] lg:min-h-[320px]">
      {/* ===== OBLATION STATUE IMAGE ===== */}
      <div className="absolute bottom-0 left-0 flex items-end">
        <img 
          src="/oble.png" 
          alt="UP Oblation" 
          className="h-auto w-auto object-contain max-w-[150px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[280px]" 
          style={{ maxHeight: '320px' }}
        />
      </div>

      <div className="container mx-auto">
        {/* ===== MAIN CONTENT GRID ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 ml-0 sm:ml-32 md:ml-48 lg:ml-72">
          
          {/* ===== LEFT COLUMN: UNIVERSITY INFO ===== */}
          <div className="flex flex-col justify-center items-center md:items-start h-full mt-4 md:mt-0">
            <div className="text-center md:text-left w-full">
              {/* Desktop University Name */}
              <h2 className="hidden md:block text-4xl font-bold mb-4 leading-tight mx-auto md:mx-0" style={{ maxWidth: '300px' }}>
                UNIVERSITY OF THE PHILIPPINES MINDANAO
              </h2>
              
              {/* Mobile University Name - 4 Lines */}
              <div className="md:hidden text-3xl font-bold mb-4 leading-tight mx-auto text-center flex flex-col">
                <span className="block">UNIVERSITY</span>
                <span className="block">OF THE</span>
                <span className="block">PHILIPPINES</span>
                <span className="block">MINDANAO</span>
              </div>
              
              {/* Address and Copyright */}
              <div className="space-y-1">
                <p className="text-xs sm:text-sm">Mintal, Tugbok District, Davao City, Philippines</p>
                <p className="text-xs">© {new Date().getFullYear()} EBL Dorm | All Rights Reserved.</p>
              </div>
            </div>
          </div>
          
          {/* ===== RIGHT COLUMN: CONTACT AND LINKS ===== */}
          <div className="mt-6 md:mt-0">
            {/* Contact Information Section */}
            <div className="mb-3">
              <h3 className="text-base font-semibold mb-1 border-b border-gray-700 pb-1">CONTACTS</h3>
              <ul className="space-y-0.5 text-xs">
                <li>Landline: (082) 293 0016</li>
                <li>Mobile: 0917 708 3627</li>
                <li>Email: ebl.dorm@up.edu.ph</li>
                <li>Office Hours: Monday to Friday, 8:00 AM to 5:00 PM</li>
              </ul>
            </div>
            
            {/* Links Section - Two Columns on Larger Screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-2">
              {/* Quick Links Column */}
              <div className="mb-3 sm:mb-0">
                <h3 className="text-base font-semibold mb-1 border-b border-gray-700 pb-1">QUICK LINKS</h3>
                <ul className="space-y-0.5 text-xs">
                  <li><a href="#" className="hover:underline">Home</a></li>
                  <li><a href="#" className="hover:underline">Services</a></li>
                  <li><a href="#" className="hover:underline">Policies & Guidelines</a></li>
                  <li><a href="#" className="hover:underline">FAQs</a></li>
                  <li><a href="#" className="hover:underline">Contact Us</a></li>
                </ul>
              </div>
              
              {/* Legal Policies Column */}
              <div>
                <h3 className="text-base font-semibold mb-1 border-b border-gray-700 pb-1">LEGAL POLICIES</h3>
                <ul className="space-y-0.5 text-xs">
                  <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                  <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
                  <li><a href="#" className="hover:underline">Refund & Cancellation Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;