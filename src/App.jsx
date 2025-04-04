import { useState, useEffect } from 'react'
import Header from './components/Header'
import LoginSidebar from './components/LoginSidebar'
import Dropdown from './components/Dropdown'

export default function App() {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true)
        setIsSidebarCollapsed(true)
      } else {
        setIsMobile(false)
        setIsSidebarCollapsed(false)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  const sidebarWidth = isMobile ? (isSidebarCollapsed ? '3rem' : '280px') : '280px'
  const dropdownFlexDirection = isMobile ? 'flex-col' : 'flex-row'

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img
          src="/eblbg.png"
          alt="Background"
          className="absolute top-[80px] left-0 object-cover object-left-bottom md:w-[calc(100vw-280px)] w-[calc(100vw-3rem)] h-[calc(100vh-80px)]"
        />
      </div>

      <div className="relative z-10">
        <Header />

        {/* Dropdown Group position */}
        <div
          className={`fixed top-[104px] flex ${dropdownFlexDirection} gap-4 z-20`}
          style={{ right: `calc(${sidebarWidth} + 1rem)` }}
        >
          <Dropdown
            title="Services"
            options={["Service 1", "Service 2", "Service 3"]}
            isActive={activeDropdown === 'services'}
            onToggle={() =>
              setActiveDropdown((prev) => (prev === 'services' ? null : 'services'))
            }
          />
          <Dropdown
            title="Contacts"
            options={["Contact 1", "Contact 2", "Contact 3"]}
            isActive={activeDropdown === 'contacts'}
            onToggle={() =>
              setActiveDropdown((prev) => (prev === 'contacts' ? null : 'contacts'))
            }
          />
        </div>

        <main className="pt-[184px] md:mr-[280px] mr-12 p-6">
        </main>

        <LoginSidebar isMobile={isMobile} isCollapsed={isSidebarCollapsed} toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      </div>
    </div>
  )
}