export default function Header() {
  return (
    <header className="bg-[#7B1113] h-20 w-full fixed top-0 left-0 z-50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo and Title Group */}
        <div className="flex items-center gap-4">
          <img src="/upd_logo.png" alt="University Logo" className="w-[60px] h-[60px]" />
          <h1 className="text-white font-bold text-2xl font-hind">EBL WebApp</h1>
        </div>
      </div>
    </header>
  );
}
