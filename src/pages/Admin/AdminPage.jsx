import {Link, Outlet} from 'react-router-dom'
import Header from './Components/Header';
import Footer from '../../components/Footer';

function AdminPage() {
    return (
    <div>

      {<Header/>}

      {<Outlet />}

      {<Footer/>}

    </div>

    )
  }
  
  export default AdminPage;