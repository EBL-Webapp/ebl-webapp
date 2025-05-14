import React from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabase_client';

function studentSignIn() {

  const navigate = useNavigate();

  const handleSubmit = async () => {

    const {data : {session}, error: errorSession} = await supabase.auth.getSession();
    if(errorSession){
      console.log('An error incurred in getting session:', errorSession);
    }

    // We register the answers to table "studentMainInfo"
    const {error: insertionError} = await supabase.from('studentMainInfo').insert([{
      userID : session.user.id,
    }])

    navigate('/NoUpdate')
  }

  return (
    <div>
      <p>Some info, dito lahat ng form</p>

      <button onClick={() => handleSubmit()}>Submit</button>
    </div>
  )
}

export default studentSignIn