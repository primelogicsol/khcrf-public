const LobbyFooter = () => {
  return (
    <footer className="bg-[#050a1e] text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white font-playfair text-xl font-bold mb-4">
              Legislative Constituency Artisan Desk
            </h3>
            <p className="text-sm leading-relaxed max-w-xs mb-6">
              Official communication platform for artisans, stakeholders, and
              policy governance. Dedicated to protecting and promoting our
              heritage crafts.
            </p>
            <div className="flex space-x-4">
              {/* Social Icons Placeholder */}
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-[#ca8a04] transition-colors cursor-pointer">
                <span className="text-xs text-white">FB</span>
              </div>
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-[#ca8a04] transition-colors cursor-pointer">
                <span className="text-xs text-white">TW</span>
              </div>
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-[#ca8a04] transition-colors cursor-pointer">
                <span className="text-xs text-white">IG</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/about"
                  className="hover:text-[#ca8a04] transition-colors"
                >
                  About KHCRF
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-[#ca8a04] transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-4">
              Governance
            </h4>
            <ul className="space-y-2 text-sm">
              <li>Hamadan Craft Revival Foundation</li>
              <li>Srinagar, J&K</li>
              <li>Official Support Line</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>
            &copy; {new Date().getFullYear()} Legislative Constituency Artisan
            Desk. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LobbyFooter;
