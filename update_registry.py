import re

file_path = 'frontend/src/config/ecosystemPartners.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Update #000053
pae_desc_regex = re.compile(r'(id:\s*"KHCRF-PTR-000053"[\s\S]*?projectDescription:\s*").*?("\s*})', re.DOTALL)
new_description = "Pre-Arrival Essentials enables travelers to pre-order familiar and trusted everyday products before reaching Kashmir, including groceries, personal-care products, dietary essentials and other practical items, so they can arrive with needed supplies ready locally instead of carrying them in their luggage."
content = pae_desc_regex.sub(rf'\g<1>{new_description}\g<2>', content)

pae_collab_regex = re.compile(r'(id:\s*"KHCRF-PTR-000053"[\s\S]*?collaborationType:\s*\[).*?(\])', re.DOTALL)
content = pae_collab_regex.sub(r'\g<1>"Pre-Order Commerce", "Traveler Essentials"\g<2>', content)

# Name mapping
mapping = {
    "Vacation With Kashmiri Craft Artisans": "ArtStay AVA",
    "Kashmir Heritage Craft Safari Discovery": "ArtStay HCS",
    "Kashmir Craft Fairs & Exhibitions": "ArtStay CFE",
    "ArtStay Craft Pickup Stores": "ArtStay CPS",
    "Craftlore Verified Flagships": "ArtStay CVF",
    "ArtStay Craft Documentation": "ArtStay CDM",
    "ArtStay Craft Shipping": "ArtStay CSH",
    "Kashmir Tour": "ArtStay KTR",
    "Eco Retreats": "ArtStay ECR",
    "Dining Voyage": "ArtStay DVG",
    "Wellness Experiences": "ArtStay WEX",
    "Eco Transit": "ArtStay ETR",
    "Attraction Tickets": "ArtStay ATX",
    "Equipment Rentals": "ArtStay EQR",
    "Travel Planner": "ArtStay TPL",
    "Travel Insurance": "ArtStay TIN",
    "Currency Exchange": "ArtStay CEX",
    "Language Services": "ArtStay LNG",
    "Tourist SIM & Internet": "ArtStay TSI",
    "Pre-Arrival Essentials": "ArtStay PAE",
    "Travel Confidence Support": "ArtStay TCS",
    "Foreigners Registration Assistance": "ArtStay IVR",
    "Accessible Travel Assistance": "ArtStay ATA",
    "Weather & Seasons": "ArtStay WSS"
}

for full, reg in mapping.items():
    escaped_full = re.escape(full)
    regex = re.compile(rf'(id:\s*"KHCRF-PTR-0000\d{{2}}"[\s\S]*?orgName:\s*"){escaped_full}(")')
    content = regex.sub(rf'\g<1>{reg}\g<2>', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated successfully.")
