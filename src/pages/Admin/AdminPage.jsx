import {Link, Outlet} from 'react-router-dom'
import Header from './Components/Header';
import Footer from '../../components/Footer';
import { useEffect } from 'react';
import { useRedirect } from '../../redirect';

function AdminPage() {

  const redirect = useRedirect();
  useEffect(() => {
    const runRedirect = async () => {
      await redirect("admin");
    };

    runRedirect();
  }, [redirect])

    return (
    <div>

      {<Header/>}

      <div className='bg-white'>
        {<Outlet />}
      </div>

      {<Footer/>}

    </div>

    )
  }
  
  export default AdminPage;