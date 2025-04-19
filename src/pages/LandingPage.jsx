import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import eblBg from '/ebl_bg.png';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header Component */}
      <Header onLoginClick={handleLoginRedirect} />

      <main className="flex-grow">
        <div className="w-full px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <section className="text-center mb-16 w-full px-4 sm:px-6">
            {/* ===== MAIN HERO IMAGE ===== */}
            <div className="mb-10">
              <img
                src={eblBg}
                alt="EBL Dormitory"
                className="mx-auto w-full max-w-4xl object-contain"
              />
            </div>

            {/* ===== HEADLINE TEXT GROUP ===== */}
            <div className="space-y-4">
              {/* Subheading */}
              <h2 style={{ color: '#194224' }} className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Get Ready for a Unique
              </h2>
              
              {/* Main Heading */}
              <h1 style={{ color: '#480000' }} className="text-4xl sm:text-5xl md:text-6xl font-bold">
                Dorm Life
              </h1>
              
              {/* Location Subheading */}
              <h3 style={{ color: '#194224' }} className="text-xl sm:text-2xl md:text-3xl font-semibold">
                at UP Mindanao!
              </h3>
            </div>

            {/* ===== TAGLINE ===== */}
            <p className="text-base sm:text-lg md:text-xl italic text-gray-600 mb-12 mt-8 px-2 sm:px-4">
              "where comfort and knowledge are within your reach"
            </p>

            {/* ===== DESCRIPTION BOX ===== */}
            <div className="bg-white px-4 py-6 sm:px-6 md:px-12 rounded-lg shadow-xl max-w-3xl mx-auto mb-10">
              <p className="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed sm:leading-loose text-justify">
                EBL is the official dormitory of UP Mindanao, providing a safe, comfortable, and affordable living space
                for both male and female students. Designed to support students throughout their university journey,
                it fosters a convenient and community-oriented environment that enhances their campus experience.
              </p>
            </div>

            {/* ===== TRANSIENT RATES BUTTON ===== */}
            <button className="bg-black hover:bg-gray-900 text-white font-semibold py-3 px-6 sm:px-8 rounded-lg transition duration-300 text-base sm:text-lg shadow-md">
              Just Visiting? Check the Transient Rates!
            </button>
          </section>
        </div>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default LandingPage;