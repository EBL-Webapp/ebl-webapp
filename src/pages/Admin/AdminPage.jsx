import {Link, Outlet} from 'react-router-dom'
import Header from './Components/Header';
import Footer from '../../components/Footer';

function AdminPage() {
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