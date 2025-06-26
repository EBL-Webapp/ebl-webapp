import { useEffect, useState } from "react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import roomImage from '/ebl_bg.png';
import { useRedirect } from '../../redirect';
import supabase from '../../supabase_client';

const TransientDashboard = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const redirect = useRedirect();
  useEffect(() => {
    
    const get_user_data = async () => {
      const {data , error} = await supabase.auth.getSession()
      if(error && error.message){
        console.log("There was an error in getting the info in TransientPage, get_user_data function: ", error.message);
        return
      }

      console.log("May data man: ", data)

      if(data != null){
        setIsLoggedIn(true);
        console.log("Pasok sa banga")
      }
      
    }

    get_user_data()

  }, [])


  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/transient/transient-form');
  };

  const handleSignUp = async () => {

    const transient_json = 'transient-sign-in'
    localStorage.setItem('Transient_Sign_Up', transient_json)

    const {error} = await supabase.auth.signInWithOAuth({
      provider : 'google'
    });

    if (error) {
      console.log("An error occured in signing-up: ", error.message);
      alert("An error occured in Google signup: ", error.message);
    }
  }


  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header variant="transient" />

      <main className="flex-grow px-6 py-12 lg:py-16 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <img src={roomImage} alt="Transient Room" className="rounded-xl shadow-md w-full h-auto object-cover" />
          </div>

          <div className="space-y-7">
            <div className="space-y-3 ">
              <h1 className="!text-3xl sm:!text-5xl font-bold text-[#4E0303] font-serif">Transient Accommodations</h1>
              <h2 className="text-base sm:text-xl text-[#114516]">designed with your stay in mind.</h2>
            </div>

            <div className="bg-[#f9f9f9] border-l-4 border-[#194224] p-6 rounded-lg shadow-md">
              <h3 className="text-base sm:text-xl font-semibold text-[#194224] mb-2">Rates</h3>
              <ul className="space-y-1 text-gray-700 text-sm sm:text-base">
                <li>• Single Room – ₱300/night</li>
                <li>• Double Room – ₱500/night</li>
                <li>• Group Room – ₱800/night</li>
              </ul>
            </div>
            <div className="border border-[#114516] rounded-xl shadow-md p-6">
              {isLoggedIn ? (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#114516] mb-2">Your Booking Status</h3>
                  <p className="text-sm sm:text-base text-gray-700">No form submitted</p>
                </div>
              ) : (
                <div>
                  <h2 className="zain-regular text-black taxt-md">You have not yet logged in, log in now to book!</h2>
                  <button onClick={() => handleSignUp()} className="text-black bg-white rounded-xl py-3 px-2 font-sans shadow-md shadow-gray border-1 border-gray-300">
                    Sign-in with Google
                  </button>
                </div>
              )}
              {/* Optional: dynamically change text based on status */}
            </div>

            <button
              onClick={handleBookNow}
              className="w-full bg-[#4E0303] text-white text-base sm:text-lg py-3 rounded-lg hover:bg-[#6a1a1a] transition duration-300"
            >
              Book Now
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TransientDashboard;
