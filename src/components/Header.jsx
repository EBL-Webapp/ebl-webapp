import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import upLogo from "@/assets/up-mindanao-logo.png";
import supabase from "../supabase_client";


export default function Header({
  variant = "landing",
  isLoggedIn = false,
}) {

  const navigate = useNavigate();

  const onLogout = async () => {
    const {error} = await supabase.auth.signOut();

    if (error) {
      alert(`Error during logout: ${error.message}`);
    }

    navigate('/')
  } 

  const load_studNum = async () => {

    const studentNumber = localStorage.getItem('studentNumber')

    setStudentNumber(studentNumber);
  }
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu(!showMenu);

  const isStudent = variant === "student";
  const isTransient = variant === "transient";

  const [showContacts] = useState(false);
  const [accountLogo, setAccountLogo] = useState("/pfp.png");
  const [userName, setUserName] = useState("Student User");
  const [studentNumber, setStudentNumber] = useState("");


  const handleLogOut = async() => {
    const result = confirm("This will log you out, do you wanna continue?")

    if(result){
      const {error} = await supabase.auth.signOut()
      if(error && error.message){
        console.log("There was an error in logging out: ", error.message)
        return
      }
      localStorage.clear()
    } else {
      alert("Logging out aborted")
    }
  }


  useEffect(() => {
    // We want to show the image of the account user
    const logoLoad = async () => {
      const session_OBJ = localStorage.getItem('Session')
      const session_STR = JSON.parse(session_OBJ)
      const session = session_STR.session

      if (session) {
        // This is for the Logo
        setAccountLogo(session.user.user_metadata.avatar_url);
        console.log('User is logged in:', session.user);

        setUserName(session.user.user_metadata.full_name);
      }
    };

    logoLoad();
    load_studNum();
  }, [])


  return (
    <header className="bg-[#4E0303] shadow-md sticky top-0 z-50 text-black text-sm font-light">
      <div className="max-w-screen-xl mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo / Title */}
        <Link to="/" className="flex items-center space-x-2" onClick={handleLogOut}>
          <img src={upLogo} alt="Logo" className="h-12 w-12 sm:h-20 sm:w-20" />
          <p className="text-white text-xs sm:text-base">UP Mindanao EBL Dorm</p>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-2 items-center text-sm font-light text-white">
        {isStudent && (
          <Link
            to="/student"
            className="bg-white !text-[#114516] font-semibold px-4 py-2 rounded-full"
          >
            Home
          </Link>
        )}

        {isTransient && (
          <Link
            to="/transient"
            className="bg-white !text-[#114516] font-semibold px-4 py-2 rounded-full"
          >
            Transient
          </Link>
        )}


          <div className="relative">

            <div
              className={`absolute right-0 bg-white text-black rounded-md shadow-lg mt-2 z-10 overflow-hidden transition-all duration-300 ease-in-out 
              ${showContacts ? 'opacity-100 max-h-60 py-2' : 'opacity-0 max-h-0 py-0'}`}
              style={{ transitionProperty: 'opacity, max-height, padding' }}
            >
              <ul>
                <li className="px-4 py-2 hover:bg-[#114516] hover:text-white cursor-pointer">
                    <a
                      href={
                        "https://mail.google.com/mail/?view=cm&fs=1&to=" +
                        encodeURIComponent("shs_osa.upmindanao@up.edu.ph") +
                        "&su=" + encodeURIComponent("Subject here") +
                        "&body=" + encodeURIComponent("Hello, I'd like to...")
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >

                      shs_osa.upmindanao@up.edu.ph
                      
                    </a>
                </li>
              </ul>
            </div>
          </div>
          
          {isStudent && isLoggedIn ? (
            <div className="flex items-center space-x-4 bg-[#114516] px-3 py-1 rounded-lg">
              <img 
                src={accountLogo} 
                alt="Profile" 
                className="h-8 w-8 rounded-full border" 
              />
              <div className="text-sm text-white">
                <p className="font-medium">{userName}</p>
                <p>{studentNumber}</p>
              </div>
              <button 
                onClick={onLogout} 
                className="text-white hover:underline !text-xs flex items-center !bg-[#4E0303] !px-1 !py-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="ml-1 hidden lg:inline">Logout</span>
              </button>
            </div>
          ) : (
            !isStudent && !isTransient &&(
              <Link 
                to="/login" 
                className="text-white bg-[#114516] hover:bg-green-800 px-4 py-2 rounded-full text-sm"
              >
                Log in
              </Link>
            )
          )}
        </nav>
        {/* MOBILE MENU (burger + dropdown) */}
        <div className="relative md:hidden">
          <button 
            onClick={toggleMenu} 
            className="focus:outline-none p-2 !bg-transparent"
            aria-label={showMenu ? "Close menu" : "Open menu"}
          >
            <Menu className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
          </button>

          {showMenu && (
            <div 
              className="absolute right-0 top-full mt-2 min-w-35 max-w-50 bg-white shadow-lg rounded-md p-2 space-y-1 z-50"
            >
              {/* Home (if student) */}
              {isStudent && (
                <Link 
                  to="/student" 
                  className="block text-xs sm:text-sm font-light text-[#114516] hover:text-green-800 px-3 py-1 rounded transition-colors duration-200"
                >
                  Home
                </Link>
              )}

              {isTransient && (
                <Link 
                  to="/transient" 
                  className="block text-xs sm:text-sm font-light text-[#114516] hover:text-green-800 px-3 py-1 rounded transition-colors duration-200"
                >
                  Transient
                </Link>
              )}


              {/* Logout (student only) */}
              {isStudent && isLoggedIn && (
                <button
                  onClick={onLogout}
                  className="flex items-center text-sm font-light text-white !bg-[#4E0303] hover:bg-red-900 px-3 py-1 rounded transition-colors duration-200 mt-2"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  <span className="text-xs sm:text-sm font-light ">Logout</span>
                </button>
              )}

              {/* Log in (landing page only) */}
              {!isStudent && (
                <Link 
                  to="/login"
                  className="block text-sm font-light !text-white bg-[#114516] hover:bg-green-800 px-4 py-2 rounded transition-colors duration-200 mt-2 text-center"
                >
                  Log in
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
