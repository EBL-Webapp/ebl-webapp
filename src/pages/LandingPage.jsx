import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import eblBg from '/ebl_bg.png';
import supabase from '../supabase_client';
import { fetchColumnValue } from '../fetchColumnValue';

const LandingPage = () => {
  const navigate = useNavigate();

  // Handler for login button click
  const handleLoginRedirect = () => {
    navigate('/login');
  };

  useEffect(() => {

    const checkUserSessionAndRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log('User is logged in:', session.user);
      }
      else {
        console.log('No user session found...');
        return;
      }

      console.log("The user is: ", session.user.id);

      // In this part we have to know if the user has an existing role or not
      // Let's check if the user exists as a student
      const studentNumber = await fetchColumnValue(
        "Students",
        "userID",
        session.user.id,
        "studentNumber",
      );
      console.log("student number is: ", studentNumber);
      if (studentNumber){
        // We need to check if this user is even accepted or not

        const {data : isAccepted, error : isAccepted_error} = await supabase
          .from('Students')
          .select('isAssessed')
          .eq("studentNumber", studentNumber)
          .limit(1);
        if(isAccepted_error){
          console.log("There's an error in retrieving if accepted student or not:", isAccepted_error.message);
        }
        if(isAccepted[0].isAssessed === true){
          navigate('/Student/StudentPage');
          return;
        } else {
          navigate('/NoUpdate')
          return;
        }
      }



      // Then let's check if the user is admin
      const adminID = await fetchColumnValue(
        "admin",
        "userID",
        session.user.id,
        "adminID",
      );
      console.log("the session ced: ", session.user.id);
      console.log('admin ID:', adminID);
      if(adminID){
        // Kailangan din ito icheck if whether accepted admin na ba siya or not.

        const {data : isItAccepted, error : isItAccepted_error} = await supabase
          .from('admin')
          .select('isAccepted')
          .eq("adminID", adminID)
          .limit(1);

        if(isItAccepted_error){
          console.log("There's an error in retrieving if accepted admin or not:", isItAccepted_error.message);
          return;
        }

        console.log("Does it exist?", isItAccepted[0]);
        
        if(isItAccepted && (isItAccepted[0].isAccepted === true)){
          navigate('/admin');
          return;
        } else {
          navigate('/NoUpdate')
          return;
        }
      }



      // Let's check if the user is a transient
      const transientID = await fetchColumnValue(
        "Transient",
        "userID",
        session.user.id,
        "transientID",
      )
      if(transientID){
        navigate("/Transient/TransientPage");
        return;
      }



      // If the user is has a session and is still in the page that means the user has not picked a role.
      navigate("/PickRole")

    };

    checkUserSessionAndRole();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ===== HEADER SECTION ===== */}
      <Header variant="landing" />

      {/* ===== MAIN CONTENT SECTION ===== */}
      <main className="flex-grow">
        <div className="w-full px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-8 sm:pb-12">
          <section className="text-center mb-12 sm:mb-16 w-full px-4 sm:px-6">
            {/* Hero Image */}
            <div className="mb-8 sm:mb-10">
              <img
                src={eblBg}
                alt="EBL Dormitory"
                className="mx-auto w-full max-w-4xl object-contain"
              />
            </div>

            {/* Headline Text Group */}
            <div className="space-y-3 sm:space-y-4">
              {/* Subheading */}
              <h2 
                style={{ color: '#194224' }} 
                className="text-3xl sm:text-3xl md:text-4xl font-bold"
              >
                Get Ready for a Unique
              </h2>
              
              {/* Main Heading */}
              <h1 
                style={{ color: '#480000' }} 
                className="text-5xl sm:text-5xl md:text-6xl font-bold"
              >
                Dorm Life
              </h1>
              
              {/* Location Subheading */}
              <h3 
                style={{ color: '#194224' }} 
                className="text-2xl sm:text-2xl md:text-3xl font-semibold"
              >
                at UP Mindanao!
              </h3>
            </div>

            {/* Tagline */}
            <p className="text-lg sm:text-lg md:text-xl italic text-gray-600 mb-10 sm:mb-12 mt-6 sm:mt-8 px-2 sm:px-4">
              "where comfort and knowledge are within your reach"
            </p>

            {/* Description Box */}
            <div className="bg-white px-4 py-6 sm:px-6 md:px-12 rounded-lg shadow-xl max-w-3xl mx-auto mb-8 sm:mb-10">
              <p className="text-base sm:text-base md:text-lg text-gray-800 leading-relaxed sm:leading-loose text-justify">
                EBL is the official dormitory of UP Mindanao, providing a safe, comfortable, and affordable living space
                for both male and female students. Designed to support students throughout their university journey,
                it fosters a convenient and community-oriented environment that enhances their campus experience.
              </p>
            </div>

            {/* Call to Action Button */}
            {/* <button className="bg-black hover:bg-gray-900 text-white font-semibold py-3 px-6 sm:px-8 rounded-lg transition duration-300 text-lg sm:text-lg shadow-md">
              Just Visiting? Check the Transient Rates!
            </button> */}
          </section>
        </div>
      </main>

      {/* ===== FOOTER SECTION ===== */}
      <Footer />
    </div>
  );
};

export default LandingPage;