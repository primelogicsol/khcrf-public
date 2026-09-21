from pathlib import Path

root = Path("backend/prisma/migrations")
failed = False

for path in sorted(root.glob("*/migration.sql")):
    data = path.read_bytes()
    null_count = data.count(b"\x00")
    print(
        f"{path}: bytes={len(data)}, "
        f"nulls={null_count}, "
        f"empty={len(data) == 0}"
    )

    if len(data) == 0 or null_count:
        failed = True

raise SystemExit(1 if failed else 0)
