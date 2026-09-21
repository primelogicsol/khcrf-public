
with open('backend/update_magazine_issues_fixed.ts', 'r') as f:
    text = f.read()

replacements = {
    '/images/generated/who-will-inherit-the-craft.png': '/images/generated/who_will_inherit_1787192060068.jpg',
    '/images/generated/the-living-loom.png': '/images/generated/the_living_loom_1787192071281.jpg',
    '/images/generated/hands-that-shape-the-valley.png': '/images/generated/architectural_hands_1787192147320.jpg',
    '/images/generated/masters-of-kani.png': '/images/generated/masters_of_kani_1787192090096.jpg',
    '/images/generated/the-copper-masters.png': '/images/generated/hands_that_shape_1787192077580.jpg',
    '/images/generated/papier-mache.png': '/images/generated/papier_mache_masters_1787192097858.jpg',
    '/images/generated/masters-of-khatamband.png': '/images/generated/masters_of_khatamband_1787192106568.jpg',
    '/images/generated/the-last-workshops.png': '/images/generated/the_last_workshops_1787192123564.jpg',
    '/images/generated/master-and-apprentice.png': '/images/generated/master_and_apprentice_1787192131202.jpg'
}

for old, new in replacements.items():
    text = text.replace(old, new)

with open('backend/update_magazine_issues_fixed.ts', 'w') as f:
    f.write(text)

