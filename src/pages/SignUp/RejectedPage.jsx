import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import supabase from '../../supabase_client';

/**
 * RejectedPage
 * Shown when a student's application has been explicitly rejected by an admin.
 * The student can choose to resubmit (goes back to StudentSignIn which upserts their data)
 * or sign out.
 */
function RejectedPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        navigate('/');
        return;
      }
      setUserName(session.user.user_metadata?.full_name || 'Student');
      setEmail(session.user.email || '');
    };
    getSession();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleReapply = () => {
    // StudentSignIn will now upsert, so going back there is safe
    navigate('/StudentSignIn');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-red-100">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 rounded-full p-4">
              <svg className="w-12 h-12 text-[#4E0303]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-[#4E0303] mb-2 zain-regular">
            Application Not Approved
          </h1>

          <p className="text-gray-600 zain-regular mb-1">
            Hi <span className="font-semibold text-gray-800">{userName}</span>,
          </p>
          <p className="text-gray-500 text-sm mb-6">
            {email}
          </p>

          <p className="text-gray-700 zain-regular mb-8">
            Unfortunately, your dormitory application was not approved by the administration.
            You may submit a new application if you believe this was a mistake, or contact
            the dorm manager directly.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleReapply}
              className="w-full bg-[#114516] hover:bg-[#1e6a23] text-white font-semibold py-3 px-6 rounded-xl transition-colors zain-regular"
            >
              Submit a New Application
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-[#4E0303] hover:bg-red-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors zain-regular"
            >
              Sign Out
            </button>
          </div>

          <p className="text-gray-400 text-xs mt-6">
            If you need assistance, please contact the EBL Dormitory administration.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default RejectedPage;
