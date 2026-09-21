import re

with open('frontend/src/components/layout/GlobalHeader.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Restore original image logo for main logo
logo_main_regex = r'<BrandLogo[\s\S]*?className="w-\[56px\].*?shrink-0"[\s\S]*?\/>'
img_main = '''<Image
              src="/assets/images/khcrf_brown_logo.png"
              alt="HCRF Logo"
              width={160}
              height={227}
              priority
              className="w-[56px] h-[56px] md:w-[80px] md:h-[80px] lg:w-[127px] lg:h-[127px] object-contain shrink-0"
            />'''

content = re.sub(logo_main_regex, img_main, content)

# Restore sticky logo
logo_sticky_regex = r'<BrandLogo[\s\S]*?className="w-\[40px\].*?shrink-0"[\s\S]*?\/>'
img_sticky = '''<Image
              src="/assets/images/khcrf_brown_logo.png"
              alt="HCRF Logo"
              width={80}
              height={80}
              className="w-[40px] h-[40px] xl:w-[80px] xl:h-[80px] object-contain shrink-0"
            />'''
content = re.sub(logo_sticky_regex, img_sticky, content)

# Restore drawer logo
logo_drawer_regex = r'<BrandLogo[\s\S]*?decorative[\s\S]*?\/>'
img_drawer = '''<Image
                src="/assets/images/khcrf_brown_logo.png"
                alt="HCRF Logo"
                width={80}
                height={80}
              />'''
content = re.sub(logo_drawer_regex, img_drawer, content)

# Remove unused BrandLogo import
content = content.replace('import { BrandLogo } from "@/components/brand/BrandLogo";\n', '')

with open('frontend/src/components/layout/GlobalHeader.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
