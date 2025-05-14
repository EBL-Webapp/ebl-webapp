import {React, useEffect, useState} from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import supabase from '../../supabase_client';
import { useNavigate } from 'react-router-dom';

function NoUpdate() {

    const navigate = useNavigate();

    const [userName, setUserName] = useState('Unidentified User');
    const [desiredRole, setDesiredRole] = useState('Unidentified Role');
    const [email, setEmail] = useState('Unknown Email');
    const [decision, setDecision] = useState('the admin will confirm you soon, thanks...')

    // We have to get the sesssion
    useEffect(() => {

        const getData = async () => {
            const {data : {session}, errorSession} = await supabase.auth.getSession();
            if(errorSession){
                console.log('Error in getting session data:', errorSession.message);
            }
            setUserName(session.user.user_metadata.full_name);
            setEmail(session.user.email);

            // Get info from a table userRoles
            const {data : roleData, error:  errorRoleData} = await supabase
                .from('userRoles')
                .select('desiredRole, roles')
                .eq('userID', session.user.id)
                .maybeSingle()

            console.log(roleData);  // Log the full roleData to check its structure


            if(errorRoleData){
                console.log('Error in getting role data:', errorRoleData);
            }

            if(roleData){
                setDesiredRole(roleData.desiredRole);
            } else {
                console.log('No role data found');
            }

            if(roleData.roles === 'denied'){
                setDecision(' the admin has unfortunately denied your role.');
            }
        }

        getData();
    }, [])

    const handleLogout = async () => {
        const {error} = await supabase.auth.signOut();
        navigate('/');
    }

  return (
    <div>

        <Header/>


            <div className='bg-white h-[500px] flex flex-col justify-center items-center'>
                <div className='mx-10'>
                    <p className='text-black zain-regular text-xl'>
                        Thanks for signing in, {userName} ({email})  as {desiredRole}, {decision}
                    </p>
                </div>

                <button className='bg-[#4E0303] text-white zain-regular text-3xl p-4 mt-20 rounded-xl hover:bg-gray-600 hover:text-black' onClick={() => handleLogout()}>
                    Log Out
                </button>
            </div>


        <Footer/>

    </div>
  )
}

export default NoUpdate