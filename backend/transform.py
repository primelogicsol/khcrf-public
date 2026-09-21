import re

with open('backend/scratch_navbar.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
content = content.replace('const Navbar = () => {', '''import FocusTrap from "focus-trap-react";
import { navLinks } from "./navData";
import { BrandLogo } from "@/components/brand/BrandLogo";

interface GlobalHeaderProps {
  mode?: "solid" | "overlay";
}

export function GlobalHeader({ mode = "solid" }: GlobalHeaderProps) {
''')

# Remove duplicate imports
content = re.sub(r'import \{ navLinks \} from "\./navData";\n*', '', content)
content = re.sub(r'const navLinks = \[.*?\];\n', '', content, flags=re.DOTALL)
content = content.replace('const Navbar = () => {', '')

# FocusTrap for Mobile Drawer
content = content.replace('      {/* Mobile Sidebar Navigation */}', '''      <FocusTrap active={isMobileMenuOpen}>
      {/* Mobile Sidebar Navigation */}''')

content = content.replace('        </div>\n      </div>\n    </header>', '        </div>\n      </div>\n      </FocusTrap>\n    </header>')

# Rename Navbar to GlobalHeader in export
content = content.replace('export default Navbar;', '')

# Colors
content = content.replace('bg-brand-secondary', 'bg-[#050A1E]')
content = content.replace('text-brand-dark', 'text-[#050A1E]')
content = content.replace('text-[#3E2723]', 'text-[#050A1E]')
content = content.replace('border-b-[#3E2723]', 'border-b-[#050A1E]')
content = content.replace('border-[#3E2723]/20', 'border-[#050A1E]/20')
content = content.replace('bg-brand-dark', 'bg-[#050A1E]')
content = content.replace('hover:bg-brand-dark', 'hover:bg-[#050A1E]')
content = content.replace('hover:text-brand-dark', 'hover:text-[#050A1E]')
content = content.replace('border-brand-dark', 'border-[#050A1E]')
content = content.replace('#D4AF37', '#CDAC36')
content = content.replace('bg-brand-primary', 'bg-[#CDAC36]')
content = content.replace('hover:bg-brand-primary', 'hover:bg-[#CDAC36]')
content = content.replace('hover:bg-brand-secondary', 'hover:bg-[#dcc059]')
content = content.replace('text-brand-primary', 'text-[#CDAC36]')
content = content.replace('hover:text-brand-primary', 'hover:text-[#CDAC36]')
content = content.replace('border-brand-primary', 'border-[#CDAC36]')
content = content.replace('border-t-brand-primary', 'border-t-[#CDAC36]')

# Semantic z-index
content = content.replace('z-50', 'z-[var(--z-header)]')
content = content.replace('z-[101]', 'z-[var(--z-sticky)]')
content = content.replace('z-[100]', 'z-[var(--z-mega-menu)]')
content = content.replace('z-[200]', 'z-[var(--z-drawer-backdrop)]')

# Overlay logic
content = content.replace('const [isHeaderSticky, setIsHeaderSticky] = useState(false);', '''const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const isOverlay = mode === "overlay" && !isHeaderSticky;''')

content = content.replace('className="bg-white hidden lg:block"', 'className={`hidden lg:block ${isOverlay ? "bg-transparent" : "bg-white"}`}')

content = content.replace('className="bg-white py-4 lg:pt-4 lg:pb-8 shadow-[0px_10px_60px_0px_rgba(0,0,0,0.1)] relative"', 'className={`py-4 lg:pt-4 lg:pb-8 relative transition-colors duration-300 ${isOverlay ? "bg-transparent shadow-none" : "bg-white shadow-[0px_10px_60px_0px_rgba(0,0,0,0.1)]"}`}')

content = content.replace('text-[16px] uppercase tracking-[0.05em] text-[#050A1E] group-hover:text-[#CDAC36]', 'text-[16px] uppercase tracking-[0.05em] transition-all duration-300 ${isOverlay ? "text-white" : "text-[#050A1E]"} group-hover:text-[#CDAC36]')

content = content.replace('text-xl text-[#050A1E] hover:text-[#CDAC36]', 'text-xl hover:text-[#CDAC36] transition-all duration-300 ${isOverlay ? "text-white" : "text-[#050A1E]"}')

# Brand Logo
logo_replace = '''<BrandLogo 
              variant="primary-full" 
              surface={isOverlay ? "auto" : "dark"} 
              size="md"
              className="w-[56px] md:w-[80px] lg:w-[127px] shrink-0"
            />'''

img_tag = '''<Image
              src="/assets/images/khcrf_brown_logo.png"
              alt="HCRF Logo"
              width={160}
              height={227}
              priority
              className="w-[56px] h-[56px] md:w-[80px] md:h-[80px] lg:w-[127px] lg:h-[127px] object-contain shrink-0"
            />'''
content = content.replace(img_tag, logo_replace)

sticky_logo_replace = '''<BrandLogo 
              variant="symbol-only" 
              surface="light" 
              size="sm"
              className="w-[40px] xl:w-[80px] shrink-0"
            />'''
sticky_img_tag = '''<Image
              src="/assets/images/khcrf_brown_logo.png"
              alt="HCRF Logo"
              width={80}
              height={80}
              className="w-[40px] h-[40px] xl:w-[80px] xl:h-[80px] object-contain shrink-0"
            />'''
content = content.replace(sticky_img_tag, sticky_logo_replace)

drawer_logo_replace = '''<BrandLogo 
                variant="primary-full" 
                surface="dark" 
                size="md"
                className="w-[80px] shrink-0"
              />'''
drawer_img_tag = '''<Image
                src="/assets/images/khcrf_brown_logo.png"
                alt="HCRF Logo"
                width={80}
                height={80}
              />'''
content = content.replace(drawer_img_tag, drawer_logo_replace)


with open('backend/scratch_navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
