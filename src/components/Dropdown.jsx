import { useState } from 'react'

export default function Dropdown({ title, options, isActive, onToggle }) {
  const [hoveredOption, setHoveredOption] = useState(null)

  return (
    <div className="w-[112px] sm:w-full transition-all duration-300 ease-in-out">
      {/* Button */}
      <button
        onClick={onToggle}
        className={`w-full h-12 flex items-center justify-between px-4 transition-all duration-300 ease-in-out
          ${isActive ? 'bg-[#9E9E9E] text-black' : 'bg-[#2C2C2C]/60 text-[#F2F2F2]'}`}
      >
        <span className="font-medium">{title}</span>
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          className={`transition-transform duration-300 ease-in-out ${isActive ? 'rotate-180' : ''}`}
        >
          <path
            d="M1 1L6 6L11 1"
            stroke={isActive ? '#000000' : '#F2F2F2'}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Dropdown Options */}
      {isActive && (
        <div className="bg-[#9E9E9E] w-full transition-all duration-300 ease-in-out">
          {options.map((option, index) => (
            <div
              key={index}
              className={`h-10 px-4 flex items-center cursor-pointer transition-colors duration-300 ease-in-out
                ${hoveredOption === index ? 'bg-[#2C2C2C]/30' : ''}`}
              onMouseEnter={() => setHoveredOption(index)}
              onMouseLeave={() => setHoveredOption(null)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 