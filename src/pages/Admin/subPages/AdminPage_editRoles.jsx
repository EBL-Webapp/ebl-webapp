import React, { useEffect, useState } from 'react';
import supabase from '../../../supabase_client';

function AdminPage_editRoles() {
  const [requests, setRequests] = useState([]);
  const [admins, setAdmins]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Fetch both pending requests and current admins
  useEffect(() => {
    fetchAllRequests();
    fetchAdmins();
  }, []);

  // 1) Fetch pending (isAccepted = false) items
  const fetchAllRequests = async () => {
    setLoading(true);
    setFetchError(null);

    const [studentsRes, transientsRes, adminsRes] = await Promise.all([
      supabase
        .from('Students')
        .select('studentNumber, userID, isAssessed, isArchived, safe_users(full_name, email)')
        .eq('isAssessed', false),
      supabase
        .from('Transient')
        .select(
          'transientID, userID, nameOfOccupant, completeAddress, contactNumber, agencyConnected, emergencyContact, isAccepted'
        )
        .eq('isAccepted', false),
      supabase
        .from('admin')
        .select('adminID, userID, adminName, isAccepted, safe_users(email)')
        .eq('isAccepted', false),
    ]);

    if (studentsRes.error || transientsRes.error || adminsRes.error) {
      setFetchError(
        studentsRes.error?.message ||
        transientsRes.error?.message ||
        adminsRes.error?.message
      );
      setLoading(false);
      return;
    }

    const studentRequests = studentsRes.data.map(r => ({
      source: 'student',
      id:     r.studentNumber,
      name:   r.safe_users.full_name,
      email:  r.safe_users.email,
      isAccepted: r.isAssessed,
    }));

    const transientRequests = transientsRes.data.map(r => ({
      source: 'transient',
      id:     r.transientID,
      name:   r.nameOfOccupant,
      email:  r.userID,            // no email join here?
      isAccepted: r.isAccepted,
    }));

    const adminRequests = adminsRes.data.map(r => ({
      source: 'admin',
      id:     r.adminID,
      name:   r.adminName,
      email:  r.safe_users.email,
      isAccepted: r.isAccepted,
    }));

    setRequests([...studentRequests, ...transientRequests, ...adminRequests]);
    setLoading(false);
  };

  // 2) Fetch current (isAccepted = true) admins
  const fetchAdmins = async () => {
    const { data, error } = await supabase
      .from('admin')
      .select('adminID, adminName, safe_users(email)')
      .eq('isAccepted', true);

    if (error) {
      console.error('Error fetching admins:', error.message);
      return;
    }

    setAdmins(
      data.map((r) => ({
        id:        r.adminID,
        adminName: r.adminName,
        email:     r.safe_users.email,
      }))
    );
  };

  // 3) Accept handler: updates the row, then refreshes both lists as needed
  const handleAccept = async (source, id) => {
    let table, pk, updateObj;
    if (source === 'student') {
      table = 'Students';    pk = 'studentNumber'; updateObj = { isAssessed: true };
    } else if (source === 'transient') {
      table = 'transients';  pk = 'transientID'; updateObj = { isAccepted: true };
    } else {
      table = 'admin';       pk = 'adminID';     updateObj = { isAccepted: true };
    }

    const { error } = await supabase
      .from(table)
      .update(updateObj)
      .eq(pk, id);

    if (error) {
      console.error('Error accepting:', error.message);
      return;
    }

    // remove from requests list
    setRequests(reqs => reqs.filter(r => !(r.source === source && r.id === id)));

    // if we just accepted an admin, reload the admin list
    if (source === 'admin') {
      fetchAdmins();
    }
  };

  // 4) Deny handler: deletes the row, then removes from requests
  const handleDeny = async (source, id) => {
    let table, pk;
    if (source === 'student') {
      table = 'Students';   pk = 'studentNumber';
    } else if (source === 'transient') {
      table = 'transients'; pk = 'transientID';
    } else {
      table = 'admin';      pk = 'adminID';
    }

    const { error } = await supabase
      .from(table)
      .delete()
      .eq(pk, id);

    if (error) {
      console.error('Error denying:', error.message);
      return;
    }

    setRequests(reqs => reqs.filter(r => !(r.source === source && r.id === id)));
  };

  // 5) Remove an already-accepted admin
  const handleRemoveAdmin = async (id) => {
    const { error } = await supabase
      .from('admin')
      .delete()
      .eq('adminID', id);

    if (error) {
      alert('Error in deleting the admin: ' + error.message);
      return;
    }
    fetchAdmins();
  };

  if (loading)   return <p>Loading…</p>;
  if (fetchError) return <p className="text-red-600">Error: {fetchError}</p>;

  return (
    <div className="py-5">
      {/* Pending Requests */}
      <div className="mx-2 p-2 border-2 border-black rounded-2xl flex flex-col gap-2 text-black zain-regular">
        <h2 className="marcellus-sc-regular text-2xl">List of Requests</h2>
        <hr />
        {requests.length > 0 ? (
          requests.map((r) => (
            <div key={`${r.source}-${r.id}`} className="flex justify-between items-center text-xl zain-regular">
              <p>Name: {r.name}</p>
              <p>Type: {r.source[0].toUpperCase() + r.source.slice(1)}</p>
              <p>Email: {r.email}</p>
              <div>
                <button
                  className="w-20 py-3 bg-[#4E0303] text-white rounded-xl mr-2 hover:bg-gray-600"
                  onClick={() => handleDeny(r.source, r.id)}
                >
                  Deny
                </button>
                <button
                  className="w-20 py-3 bg-[#4E0303] text-white rounded-xl mr-2 hover:bg-gray-600"
                  onClick={() => handleAccept(r.source, r.id)}
                >
                  Accept
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xl">No pending requests</p>
        )}
      </div>

      {/* Current Admins */}
      <div className="mx-2 mt-5 p-2 border-2 border-black rounded-2xl flex flex-col gap-2 text-black zain-regular">
        <h2 className="marcellus-sc-regular text-2xl">List of Admins</h2>
        <hr />
        {admins.length > 0 ? (
          admins.map((a) => (
            <div key={a.id} className="flex justify-between items-center text-xl zain-regular">
              <p>Name: {a.adminName}</p>
              <p>Email: {a.email}</p>
              <button
                className="w-20 py-3 bg-[#4E0303] text-white rounded-xl mr-2 hover:bg-gray-600"
                onClick={() => handleRemoveAdmin(a.id)}
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="text-xl">No records of admin</p>
        )}
        <p className="text-sm">
          <strong>*You cannot delete your own account</strong>
        </p>
      </div>
    </div>
  );
}

export default AdminPage_editRoles;
