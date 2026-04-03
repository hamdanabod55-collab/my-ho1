export function Footer() {
  return (
    <footer className="w-full bg-[#050a14] border-t border-white/10 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-serif text-[#E11D48] mb-4 tracking-widest">LUMINARY CINEMA</h2>
        <p className="text-gray-500 text-sm max-w-md font-sans">
          Exclusive premium cinematic experiences. Step into the dark and unveil the masterpieces hidden within.
        </p>
        <div className="mt-8 text-xs text-gray-600">
          © {new Date().getFullYear()} Luminary Cinema. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
