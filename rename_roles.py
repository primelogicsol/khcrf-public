import re

file_path = 'frontend/src/config/ecosystemPartners.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

updates = {
    "ArtStay KTR": "ArtStay KTR - Kashmir Tour for craft and cultural travelers",
    "ArtStay ECR": "ArtStay ECR - Eco Retreats connected to craft, heritage and local culture",
    "ArtStay DVG": "ArtStay DVG - Dining Voyage integrated into the craft and cultural journey",
    "ArtStay WEX": "ArtStay WEX - Wellness Experiences for cultural and craft travelers",
    "ArtStay ETR": "ArtStay ETR - Eco Transit connecting craft, heritage and tourism destinations",
    "ArtStay ATX": "ArtStay ATX - Attraction Tickets supporting craft and heritage itineraries",
    "ArtStay EQR": "ArtStay EQR - Equipment Rentals for craft, heritage and cultural exploration",
    "ArtStay TPL": "ArtStay TPL - Travel Planner building craft-centered itineraries",
    "ArtStay TIN": "ArtStay TIN - Travel protection facilitation for ArtStay cultural journeys",
    "ArtStay CEX": "ArtStay CEX - Currency-access support for international craft travelers",
    "ArtStay LNG": "ArtStay LNG - Language support between visitors, artisans and communities",
    "ArtStay TSI": "ArtStay TSI - Connectivity support for international cultural travelers",
    "ArtStay PAE": "ArtStay PAE - Trusted products pre-ordered for arrival in Kashmir",
    "ArtStay TCS": "ArtStay TCS - Confidence and destination support for craft travelers",
    "ArtStay IVR": "ArtStay IVR - International Visitor Readiness and e-FRRO support",
    "ArtStay ATA": "ArtStay ATA - Accessible craft and cultural travel assistance",
    "ArtStay WSS": "ArtStay WSS - Weather and seasonal intelligence for craft-tourism planning"
}

for key, val in updates.items():
    regex = re.compile(rf'(orgName:\s*"){re.escape(key)}(")')
    content = regex.sub(rf'\g<1>{val}\g<2>', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Roles updated successfully.")
