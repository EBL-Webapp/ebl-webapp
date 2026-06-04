import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#5a0000] text-white pt-6 pb-3 px-4 relative">
      <div className="container mx-auto">
        {/* Main grid layout - single column on mobile, two columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          
          {/*Oblation statue */}
          <div className="absolute bottom-0 left-0 hidden md:flex items-end pointer-events-none">
            <img 
              src="/oble.png" 
              alt="UP Oblation" 
              className="h-auto w-auto object-contain md:max-w-45 lg:max-w-55" 
              style={{ maxHeight: '280px' }}
            />
          </div>
          
          {/* Mobile header with Oblation and university name */}
          <div className="sm:hidden flex items-end mb-4">
            <div className="shrink-0">
              <img 
                src="/oble.png" 
                alt="UP Oblation" 
                className="h-auto w-auto object-contain max-w-25" 
                style={{ maxHeight: '150px' }}
              />
            </div>
            <div className="ml-4 grow">
              <div className="text-xl font-bold leading-tight">
                <span className="block">UNIVERSITY</span>
                <span className="block">OF THE</span>
                <span className="block">PHILIPPINES</span>
                <span className="block">MINDANAO</span>
              </div>
            </div>
          </div>
          
          {/* Left column - University info */}
          <div className="flex flex-col justify-center items-center md:items-start h-full md:pl-40 lg:pl-48">
            <div className="text-center md:text-left w-full">
              {/* Desktop university name */}
              <h2 className="hidden md:block text-3xl lg:text-4xl font-bold mb-4 leading-tight mx-auto md:mx-0" style={{ maxWidth: '300px' }}>
                UNIVERSITY OF THE PHILIPPINES MINDANAO
              </h2>
              
              {/* Address and copyright */}
              <div className="space-y-1 sm:mt-4 md:mt-0">
                <p className="text-xs sm:text-sm">Mintal, Tugbok District, Davao City, Philippines</p>
                <p className="text-xs">© {new Date().getFullYear()} EBL Dorm | All Rights Reserved.</p>
              </div>
            </div>
          </div>
          
          {/* Right column - Contacts and links */}
          <div className="mt-6 md:mt-0">
            {/* Contact information */}
            <div className="mb-4">
              <h3 className="text-base font-semibold mb-2 border-b border-gray-700 pb-1">CONTACTS</h3>
              <ul className="space-y-1 text-xs sm:text-sm">
                <li>Landline: (082) 293 0016</li>
                <li>Mobile: 0917 708 3627</li>
                <li>Email: ebl.dorm@up.edu.ph</li>
                <li>Office Hours: Monday to Friday, 8:00 AM to 5:00 PM</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;