
function Loading() {

  return (
    <div className='fixed inset-0 bg-white/10 backdrop-blur-xs  z-10 flex items-center justify-center'>
        <div class="relative backdrop-blur-md px-10 py-8 bg-gray-50/5 rounded-2xl flex flex-row items-center shadow-xl border overflow-hidden ">
            {/* Gradient Overlay */}
            <div class="absolute inset-0 bg-gradient-to-tr from-purple-400 via-pink-500 to-red-500 opacity-0 duration-300 animate-pulse"></div>
            <span class="relative z-10">
                <div class='p-2 absolute rounded-full bg-gray-400 animate-ping'></div>
                <div class='p-2 relative z-10 rounded-full bg-pink-500'></div>
            </span>
            {/* Content - ensure it's above the overlay */}
            <span class="relative z-10 ml-3"> {/* z-10 ensures content is on top of the overlay */}
                <p class='text-gray-600 zain-regular md:text-2xl sm:text-sm mr-5 transition-colors duration-500'>Loading...</p>
            </span>

        </div>
    </div>
  )
}

export default Loading