from pathlib import Path

path_200000 = Path("backend/prisma/migrations/20260717200000_phase_4_1d_write_safety/migration.sql")
data = path_200000.read_bytes()
if b"\x00" in data:
    text = data.decode("utf-16")
    path_200000.write_text(text, encoding="utf-8")
    print("Fixed 200000 encoding.")

for empty_path in [
    "backend/prisma/migrations/20260717195214_phase_4_1d_write_safety/migration.sql",
    "backend/prisma/migrations/20260723000000_add_magazine_issue/migration.sql"
]:
    p = Path(empty_path)
    if p.exists() and len(p.read_bytes()) == 0:
        p.write_text("-- This migration is intentionally empty to consolidate with later migrations.\n", encoding="utf-8")
        print(f"Fixed empty {p.name}")
