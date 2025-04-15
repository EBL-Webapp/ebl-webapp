import {Link} from 'react-router-dom'

function AdminPage() {
    return (
    <div>

      <h1 className="text-3xl font-bold text-center mt-10">Welcome to the Admin Page</h1>

      <Link to="/overstayPermits">Overstay Permits</Link> <br/>   
      <Link to="/editOffenses">Edit Offenses</Link>  <br/>
      <Link to="/studentsArchive">Student Archive</Link> <br/>
      <Link to="/studentsPayments">Student Payments</Link> <br/>
      <Link to="/transientRequests">Transient Requests</Link>

    </div>

    )
  }
  
  export default AdminPage;