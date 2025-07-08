import React from 'react';

// PaginationControls Component
// This component renders the pagination UI.
// It receives data about the total rows, rows per page, and current page,
// and provides a function to call when the page changes.
function PaginationControls({
  rowsPerPage,      // Number of items to display per page (e.g., 10)
  totalRows,        // Total number of items available in the database (from Supabase count)
  currentPage,      // The currently active page number (1-based)
  onPageChange,     // Function to call when a page is selected: onPageChange(newPageNumber)
}) {
  // Calculate the total number of pages
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  // Function to generate the array of page numbers to display in the UI.
  // This logic aims to show a few pages around the current page, plus the first and last page,
  // with ellipses (...) for skipped ranges.
  const getPageNumbers = () => {
    const pageNumbers = [];
    // Adjust maxPageNumbersToShow for smaller screens
    const maxPageNumbersToShow = window.innerWidth < 640 ? 3 : 5; // Show fewer on small screens
    const half = Math.floor(maxPageNumbersToShow / 2);

    let startPage = Math.max(1, currentPage - half);
    let endPage = Math.min(totalPages, currentPage + half);

    // Adjust start/end if we're near the beginning or end to fill the maxPageNumbersToShow
    if (endPage - startPage + 1 < maxPageNumbersToShow) {
      startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
    }
    if (endPage - startPage + 1 < maxPageNumbersToShow) {
      endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push('...');
      }
    }

    // Add pages in the calculated range
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis and last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const displayedPageNumbers = getPageNumbers();

  // Handlers for navigation buttons
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleSpecificPage = (pageNumber) => {
    if (pageNumber !== '...') { // Don't try to navigate to ellipsis
      onPageChange(pageNumber);
    }
  };

  return (
    <div className='mt-15 flex flex-row justify-center px-4 sm:px-0'> {/* Added px-4 for small screen padding */}
      <div className='
        text-black
        relative
        px-5 py-2
        rounded-3xl
        shadow-2xl
        w-full sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] /* Adjusted responsive widths */
        border border-gray-200/30
        group
        bg-gradient-to-br
        from-gray-400/20
      '>
        {/* Gradient Overlay for the card hover effect */}
        <div className='
          bg-gradient-to-tr inset-0 absolute
          rounded-3xl
          from-purple-400 via-pink-500 to-red-500
          opacity-0
          group-hover:opacity-20
          transition-opacity ease-out duration-300
        '></div>

        {/* Main container for arrows and numbers */}
        <div className='zain-regular flex text-black flex-row justify-between items-center w-full'>

          {/* Back Arrow Button (Left End) */}
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className='
              w-8 h-8
              flex items-center justify-center
              z-[3]
              text-gray-600 hover:text-blue-600
              transition-all duration-100 ease-in-out
              relative
              transform
              hover:scale-110 hover:shadow-md
              hover:rounded-full hover:bg-white/50
              cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
            '>
            <span className="material-symbols-outlined text-base">
              arrow_back_ios_new
            </span>
          </button>

          {/* Numbers Container (Middle) */}
          <div className="flex flex-row gap-2 justify-center">
            {displayedPageNumbers.map((page, index) => (
              <p
                key={index}
                onClick={() => handleSpecificPage(page)}
                className={`
                  w-8 h-8
                  flex items-center justify-center
                  z-[3]
                  transition-all duration-100 ease-in-out
                  relative
                  transform
                  hover:rounded-full
                  hover:bg-white
                  hover:shadow-md
                  hover:scale-110
                  cursor-pointer
                  ${page === '...' ? 'cursor-default opacity-50' : ''}
                  ${page === currentPage ? 'bg-white scale-110 border-2 border-gray-400 rounded-full shadow-md' : 'text-gray-600 hover:backdrop-blur-md'}
                `}
              >
                {page}
              </p>
            ))}
          </div>

          {/* Forward Arrow Button (Right End) */}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className='
              w-8 h-8
              flex items-center justify-center
              z-[3]
              text-gray-600 hover:text-blue-600
              transition-all duration-100 ease-in-out
              relative
              transform
              hover:scale-110 hover:shadow-md
              hover:rounded-full hover:bg-white/50
              cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
            '>
            <span className="material-symbols-outlined text-base">
              arrow_forward_ios
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaginationControls;
