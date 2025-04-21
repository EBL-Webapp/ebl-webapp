import React from 'react'
import '../Styles/overstayPermits.css'

function AdminPage_overstayPermits() {
  return (
    <>

      <div className='lg:grid lg:grid-cols-3 lg:gap-2'>

        <div className='justify-center flex mb-10 lg:col-span-2'>
          <div className='w-[95%] h-fit bg-white mt-6 rounded-4xl border-2 border-black text-black'>
            {/* This part is the quickinfo part, this will provide the info about student, name and reason */}
            <div className='zain-regular text-[12px] p-5'>
              {/* This part is the upper part */}
              <div className='grid grid-cols-3 lg:text-[20px] '>
                <p className='col-span-2'>Name: __________________</p>
                <p className='col-span-1'>Student #:  __________________</p>
              </div>
              <p className='mt-5 lg:text-[20px] '>Duration:</p>
              <div className='flex lg:text-[20px] '>
                <p className=''>From: ____________</p>
                <p className=''>To:  ______________</p>
              </div>

              <div className='mt-4 lg:text-[20px] ' >
                <p>Reason for Overnight Slip: ___________________________________________</p>
              </div>
            </div>

            {/* This part is where we can compare the medical and extra info */}
            <div className=' border-t-3 border-b-3 mb-5 grid grid-cols-2 zain-regular lg:text-[20px] '>
              {/* Left Part */}
              <div className='border-r-3 border-black p-1'>
                <p>Medical Conditions:</p>
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil, aliquam. Magni ad hic dolorum consectetur quisquam molestias possimus pariatur repellendus!</p>
              </div>
              {/* Right Part */}
              <div className='p-1'>
                <p>Parents' Consent:</p>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laboriosam nobis veritatis vitae reprehenderit. Pariatur quisquam ab ratione porro aut quidem amet corrupti maxime dolorum. Laudantium incidunt quia cupiditate rem reprehenderit!</p>
              </div>
            </div>
            {/* This is for the buttonsbg-[#4E0303] */}
            <div className='flex justify-end mr-5'>
              <button className='bg-[#4E0303] text-white rounded-2xl px-5 py-2 ml-5 mb-5 hover:bg-red-900'>Approve</button>
              <button className='bg-[#4E0303] text-white rounded-2xl px-5 py-2 ml-5 mb-5  hover:bg-red-900'>Deny</button>
            </div>
          </div>
        </div>


        {/* The next div is for cards */}
        <div className='m-4 justify-center grid grid-cols-2 gap-2 lg:col-span-1'>
          {/* Single Card instance */}
          <div className='border-2 border-black p-2 rounded-2xl zain-regular text-black h-fit'>
            <div className='zair-regular'>
              <p>Name:</p>
              <p>Student #:</p>
              <p>Duration:</p>
              <div className='ml-4'>
                <p>From:</p>
                <p>To:</p>
              </div>
              <hr/>
            </div>
            <div className='flex justify-end gap-3'>
              <button className='p-2 bg-[#4E0303] mt-1 rounded-2xl text-white zain-regular w-15 hover:bg-red-900' >Approve</button>
              <button className='p-2 bg-[#4E0303] mt-1 rounded-2xl text-white zain-regular w-15 hover:bg-red-900' >Deny</button>
            </div>
          </div>

          <div className='border-2 border-black p-2 rounded-2xl zain-regular text-black h-fit'>
            <div className='zair-regular'>
              <p>Name:</p>
              <p>Student #:</p>
              <p>Duration:</p>
              <div className='ml-4'>
                <p>From:</p>
                <p>To:</p>
              </div>
              <hr/>
            </div>
            <div className='flex justify-end gap-3'>
              <button className='p-2 bg-[#4E0303] mt-1 rounded-2xl text-white zain-regular w-15 hover:bg-red-900' >Approve</button>
              <button className='p-2 bg-[#4E0303] mt-1 rounded-2xl text-white zain-regular w-15 hover:bg-red-900' >Deny</button>
            </div>
          </div>

          <div className='border-2 border-black p-2 rounded-2xl zain-regular text-black h-fit'>
            <div className='zair-regular'>
              <p>Name:</p>
              <p>Student #:</p>
              <p>Duration:</p>
              <div className='ml-4'>
                <p>From:</p>
                <p>To:</p>
              </div>
              <hr/>
            </div>
            <div className='flex justify-end gap-3'>
              <button className='p-2 bg-[#4E0303] mt-1 rounded-2xl text-white zain-regular w-15 hover:bg-red-900' >Approve</button>
              <button className='p-2 bg-[#4E0303] mt-1 rounded-2xl text-white zain-regular w-15 hover:bg-red-900' >Deny</button>
            </div>
          </div>

          <div className='border-2 border-black p-2 rounded-2xl zain-regular text-black h-fit'>
            <div className='zair-regular'>
              <p>Name:</p>
              <p>Student #:</p>
              <p>Duration:</p>
              <div className='ml-4'>
                <p>From:</p>
                <p>To:</p>
              </div>
              <hr/>
            </div>
            <div className='flex justify-end gap-3'>
              <button className='p-2 bg-[#4E0303] mt-1 rounded-2xl text-white zain-regular w-15 hover:bg-red-900' >Approve</button>
              <button className='p-2 bg-[#4E0303] mt-1 rounded-2xl text-white zain-regular w-15 hover:bg-red-900' >Deny</button>
            </div>
          </div>

          <div className='border-2 border-black p-2 rounded-2xl zain-regular text-black h-fit'>
            <div className='zair-regular'>
              <p>Name:</p>
              <p>Student #:</p>
              <p>Duration:</p>
              <div className='ml-4'>
                <p>From:</p>
                <p>To:</p>
              </div>
              <hr/>
            </div>
            <div className='flex justify-end gap-3'>
              <button className='p-2 bg-[#4E0303] mt-1 rounded-2xl text-white zain-regular w-15 hover:bg-red-900' >Approve</button>
              <button className='p-2 bg-[#4E0303] mt-1 rounded-2xl text-white zain-regular w-15 hover:bg-red-900' >Deny</button>
            </div>
          </div>

          <div className='border-2 border-black p-2 rounded-2xl zain-regular text-black h-fit'>
            <div className='zair-regular'>
              <p>Name:</p>
              <p>Student #:</p>
              <p>Duration:</p>
              <div className='ml-4'>
                <p>From:</p>
                <p>To:</p>
              </div>
              <hr/>
            </div>
            <div className='flex justify-end gap-3'>
              <button className='p-2 bg-[#4E0303] mt-1 rounded-2xl text-white zain-regular w-15 hover:bg-red-900' >Approve</button>
              <button className='p-2 bg-[#4E0303] mt-1 rounded-2xl text-white zain-regular w-15 hover:bg-red-900' >Deny</button>
            </div>
          </div>

          
          
        </div>

      </div>



      

    </>
  )
}

export default AdminPage_overstayPermits