import React from 'react'
import { useState } from 'react'

function AdminPage_editOffenses() {

  const [offensesType, setOffensesType] = useState(false);
  const addOffenseType = () => {
    setOffensesType(!offensesType);
  }

  const [offense, setOffense] = useState(false);
  const addOffense = () => {
    setOffense(!offense);
  }

  const [editOffenseStatus, setEditOffense] = useState(false);
  const editOffense = () => {
    setEditOffense(!editOffenseStatus);
  }

  return (
    <>
      {/* This div is meant for covering the entire screen */}
        {offense && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/75">
            <div className="bg-white zain-regular text-black rounded-2xl p-5 md:w-[50%]">
              <form className='w-full'>
                <label >Name of Student:</label><br/>
                <input type='text' id='nameStudent' className='border-b-2 w-full' /> <br/>
                <label >Name of Admin: </label> <br/>
                <p><u>Admin of Name Here</u></p> <br/>
                <label>Offense Type: </label> <br/>
                <select className='border-b-2 border-black mb-3 w-full'>
                  <option value=''>Select Offense Type</option>
                  <option value=''>Offense Type 1</option> 
                  <option value=''>Offense Type 2</option>
                  <option value=''>Offense Type 3</option>
                </select> <br/>
                <label >Date</label> <br/>
                <input type='date' id='date' className='border-b-2 border-black w-full' /> <br/>

              </form>

              <div className='flex justify-end'>
                <button className='p-2 bg-[#4E0303] text-white rounded-lg m-2  hover:bg-[#1e6a23] hover:text-black'>Done</button>
                <button className='p-2 bg-[#4E0303] text-white rounded-lg m-2  hover:bg-[#1e6a23] hover:text-black' onClick={addOffense}>Cancel</button>                
              </div>


            </div>
          </div>
        )}

              {/* This div is meant for covering the entire screen */}
        {offensesType && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/75">
            <div className="bg-white zain-regular text-black rounded-2xl p-5 md:w-[50%]">
              <form>
                <label>Name of Admin: </label> <br/>
                <p><u>Admin of Name Here</u></p> <br/>
                <label>Offense Type: </label> <br/>
                <select className='border-b-2 border-black mb-3 w-full'>
                  <option value=''>Select Offense Type</option>
                  <option value=''>Offense Type 1</option> 
                  <option value=''>Offense Type 2</option>
                  <option value=''>Offense Type 3</option>
                </select> <br/>
                <label>Offense Severity:</label> <br/>
                <select className='border-b-2 border-black mb-3 w-full'>
                  <option value=''>Select Severity Type</option>
                  <option value=''>Offense Type 1</option> 
                  <option value=''>Offense Type 2</option>
                  <option value=''>Offense Type 3</option>
                </select> <br/>
                <label >Date</label> <br/>
                <input type='date' id='date' className='border-b-2 border-black w-full' /> <br/>

              </form>

              <button className='p-2 bg-[#4E0303] text-white rounded-lg m-2  hover:bg-[#1e6a23] hover:text-black'>Done</button>
              <button className='p-2 bg-[#4E0303] text-white rounded-lg m-2  hover:bg-[#1e6a23] hover:text-black' onClick={addOffenseType}>Cancel</button>
            </div>
          </div>
        )}

        {editOffenseStatus && (
          <div className='fixed inset-0 z-[100] flex justify-center bg-gray-900/75 overflow-y-auto py-10 px-4'>
            <div className='bg-white zain-regular text-black rounded-2xl p-5 w-[90%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-5 h-fit'>
              <p className='col-span-1 md:col-span-2 lg:col-span-3' >Student Name: </p>
              <p className='col-span-1 md:col-span-2 lg:col-span-3' >Student Number: </p>

              <button className='col-span-1 md:col-span-2 lg:col-span-3 bg-[#4E0303] p-1 text-white rounded-xl hover:bg-[#1e6a23] hover:text-black' onClick={editOffense}>Return</button>

              {/* One Card */}

              <div className='m-1 border-1 border-black rounded-xl'>
                <label>Date:</label>
                <input type='date'/> <br/>
                <hr/>
                <label>Offense Type:</label>
                <select className='border-b-2 border-black mb-3 w-full'>
                  <option value=''>Select Offense Type</option>
                  <option value=''>Offense Type 1</option> 
                  <option value=''>Offense Type 2</option>
                  <option value=''>Offense Type 3</option>
                </select> <br/>
                <label>Administered by:</label>
                <p><u>Admin of Name Here</u></p> <br/>

                <div className='flex justify-end'>
                  <button className='p-2 bg-[#4E0303] text-white rounded-lg m-2  hover:bg-[#1e6a23] hover:text-black'>Save Edit</button>
                  <button className='p-2 bg-[#4E0303] text-white rounded-lg m-2  hover:bg-[#1e6a23] hover:text-black'>Delete</button>
                </div>

              </div>

              <div className='m-1 border-1 border-black rounded-xl'>
                <label>Date:</label>
                <input type='date'/> <br/>
                <hr/>
                <label>Offense Type:</label>
                <select className='border-b-2 border-black mb-3 w-full'>
                  <option value=''>Select Offense Type</option>
                  <option value=''>Offense Type 1</option> 
                  <option value=''>Offense Type 2</option>
                  <option value=''>Offense Type 3</option>
                </select> <br/>
                <label>Administered by:</label>
                <p><u>Admin of Name Here</u></p> <br/>

                <div className='flex justify-end'>
                  <button className='p-2 bg-[#4E0303] text-white rounded-lg m-2  hover:bg-[#1e6a23] hover:text-black'>Save Edit</button>
                  <button className='p-2 bg-[#4E0303] text-white rounded-lg m-2  hover:bg-[#1e6a23] hover:text-black'>Delete</button>
                </div>

              </div>

              <div className='m-1 border-1 border-black rounded-xl'>
                <label>Date:</label>
                <input type='date'/> <br/>
                <hr/>
                <label>Offense Type:</label>
                <select className='border-b-2 border-black mb-3 w-full'>
                  <option value=''>Select Offense Type</option>
                  <option value=''>Offense Type 1</option> 
                  <option value=''>Offense Type 2</option>
                  <option value=''>Offense Type 3</option>
                </select> <br/>
                <label>Administered by:</label>
                <p><u>Admin of Name Here</u></p> <br/>

                <div className='flex justify-end'>
                  <button className='p-2 bg-[#4E0303] text-white rounded-lg m-2  hover:bg-[#1e6a23] hover:text-black'>Save Edit</button>
                  <button className='p-2 bg-[#4E0303] text-white rounded-lg m-2  hover:bg-[#1e6a23] hover:text-black'>Delete</button>
                </div>

              </div>
              <div className='m-1 border-1 border-black rounded-xl'>
                <label>Date:</label>
                <input type='date'/> <br/>
                <hr/>
                <label>Offense Type:</label>
                <select className='border-b-2 border-black mb-3 w-full'>
                  <option value=''>Select Offense Type</option>
                  <option value=''>Offense Type 1</option> 
                  <option value=''>Offense Type 2</option>
                  <option value=''>Offense Type 3</option>
                </select> <br/>
                <label>Administered by:</label>
                <p><u>Admin of Name Here</u></p> <br/>

                <div className='flex justify-end'>
                  <button className='p-2 bg-[#4E0303] text-white rounded-lg m-2  hover:bg-[#1e6a23] hover:text-black'>Save Edit</button>
                  <button className='p-2 bg-[#4E0303] text-white rounded-lg m-2  hover:bg-[#1e6a23] hover:text-black'>Delete</button>
                </div>

              </div>

            </div>
          </div>
        )}
        
          
          {/* Search Part */}
          <div className='flex justify-center gap-3 zain-regular text-black max-md:my-5 max-md:mx-10 max-sm:flex-col'>
            <div >
              <form className='max-md:flex max-md:flex-col'>
                <input type='text' placeholder='Search by Name:' id='searchByName' className='py-2 px-4 rounded-2xl border-2'></input>
                <button className='m-2 bg-[#114516] text-white py-2 px-3 rounded-2xl hover:bg-[#1e6a23] hover:text-black' >Search</button>
              </form>
            </div>
            <div>
              <form className='max-md:flex max-md:flex-col'>
                <input type='text' placeholder='Student Number:' id='searchByStudentNumber' className='py-2 px-4 rounded-2xl border-2'></input>
                <button className='m-2 bg-[#114516] text-white py-2 px-3 rounded-2xl hover:bg-[#1e6a23] hover:text-black' >Search</button>
              </form>
            </div>
            <div className='flex justify-around'>
              <button className='m-2 bg-[#114516] text-white py-2 px-3 rounded-2xl hover:bg-[#1e6a23] hover:text-black ' onClick={addOffenseType}>Add Offense Type</button>
              <button className='m-2 bg-[#114516] text-white py-2 px-3 rounded-2xl hover:bg-[#1e6a23] hover:text-black' onClick={addOffense}>ADD OFFENSE</button>
            </div>
          </div>

          {/* The Display Part */}
          <div className='p-4 m-5 border-2 border-black rounded-2xl zain-regular text-black h-fit'>

            {/* This is one instance of result */}
            <div className='flex justify-between text-[10px] md:text-[12px] lg:text-[20px] items-center'>
              <div>
                <p>Name:</p>
              </div>
              <div>
                <p>Student Number:</p>
              </div>
              <div>
                <button className='m-2 bg-[#114516] text-white py-2 px-3 rounded-2xl hover:bg-[#1e6a23] hover:text-black' onClick={editOffense}>Edit Offenses</button>
              </div>
            </div>

            <div className='flex justify-between text-[10px] md:text-[12px] lg:text-[20px] items-center'>
              <div>
                <p>Name:</p>
              </div>
              <div>
                <p>Student Number:</p>
              </div>
              <div>
                <button className='m-2 bg-[#114516] text-white py-2 px-3 rounded-2xl hover:bg-[#1e6a23] hover:text-black' onClick={editOffense}>Edit Offenses</button>
              </div>
            </div>

            <div className='flex justify-between text-[10px] md:text-[12px] lg:text-[20px] items-center'>
              <div>
                <p>Name:</p>
              </div>
              <div>
                <p>Student Number:</p>
              </div>
              <div>
                <button className='m-2 bg-[#114516] text-white py-2 px-3 rounded-2xl hover:bg-[#1e6a23] hover:text-black' onClick={editOffense}>Edit Offenses</button>
              </div>
            </div>

            <div className='flex justify-between text-[10px] md:text-[12px] lg:text-[20px] items-center'>
              <div>
                <p>Name:</p>
              </div>
              <div>
                <p>Student Number:</p>
              </div>
              <div>
                <button className='m-2 bg-[#114516] text-white py-2 px-3 rounded-2xl hover:bg-[#1e6a23] hover:text-black' onClick={editOffense}>Edit Offenses</button>
              </div>
            </div>

            <div className='flex justify-between text-[10px] md:text-[12px] lg:text-[20px] items-center'>
              <div>
                <p>Name:</p>
              </div>
              <div>
                <p>Student Number:</p>
              </div>
              <div>
                <button className='m-2 bg-[#114516] text-white py-2 px-3 rounded-2xl hover:bg-[#1e6a23] hover:text-black' onClick={editOffense}>Edit Offenses</button>
              </div>
            </div>

            <div className='flex justify-between text-[10px] md:text-[12px] lg:text-[20px] items-center'>
              <div>
                <p>Name:</p>
              </div>
              <div>
                <p>Student Number:</p>
              </div>
              <div>
                <button className='m-2 bg-[#114516] text-white py-2 px-3 rounded-2xl hover:bg-[#1e6a23] hover:text-black' onClick={editOffense}>Edit Offenses</button>
              </div>
            </div>

            
          </div>



    </>
  )
}

export default AdminPage_editOffenses