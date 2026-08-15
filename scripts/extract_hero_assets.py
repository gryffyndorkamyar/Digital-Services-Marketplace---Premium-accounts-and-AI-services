"""
Extract clean hero assets from OVYRA mockup (no baked text).
Output: frontend/public/brand/hero-assets/
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "frontend" / "public" / "brand" / "hero-assets"

SOURCES = [
    ROOT / "frontend" / "public" / "brand" / "hero-realm-source.png",
    Path(
        r"C:\Users\kamyar\.cursor\projects\c-Users-kamyar-Desktop-mignum\assets"
        r"\c__Users_kamyar_AppData_Roaming_Cursor_User_workspaceStorage_f280482668b640d113661bf33149ba9b_images"
        r"_WhatsApp_Image_2026-08-14_at_13.31.04__1_-1fa44bfb-d5c3-4343-9f0c-6cf7328ae3cb.png"
    ),
    ROOT / "frontend" / "public" / "brand" / "hero-realm.png",
]

# Ratios tuned for 1024×682 mockup — monument only, no left copy / nav / footer / cards
MONUMENT_BOX = (0.395, 0.108, 0.865, 0.642)
# Card row only — excludes scroll / closing footer text below
CARDS_BOX = (0.242, 0.668, 0.758, 0.802)
CARD_COUNT = 10


def find_source() -> Path:
    for p in SOURCES:
        if p.is_file():
            return p
    raise FileNotFoundError("Mockup source image not found")


def box_to_pixels(box: tuple[float, float, float, float], w: int, h: int) -> tuple[int, int, int, int]:
    x0, y0, x1, y1 = box
    return (int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h))


def trim_black(im: Image.Image, pad: int = 0) -> Image.Image:
    """Trim uniform black margins while keeping subtle glow halos."""
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    min_x, min_y, max_x, max_y = w, h, 0, 0
    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            if r + g + b > 18:
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)
    if max_x <= min_x:
        return im
    x0 = max(0, min_x - pad)
    y0 = max(0, min_y - pad)
    x1 = min(w, max_x + 1 + pad)
    y1 = min(h, max_y + 1 + pad)
    return im.crop((x0, y0, x1, y1))


def main() -> None:
    src = find_source()
    ASSETS.mkdir(parents=True, exist_ok=True)
    backup = ASSETS / "mockup-source.png"
    if src.resolve() != backup.resolve():
        Image.open(src).save(backup)

    base = Image.open(src).convert("RGB")
    w, h = base.size
    print(f"Source: {src} ({w}x{h})")

    # ── Monument: ring + eye + rocks, full fidelity, black background ──
    mbox = box_to_pixels(MONUMENT_BOX, w, h)
    monument = base.crop(mbox)
    monument = trim_black(monument.convert("RGBA"), pad=2)
    monument.save(ASSETS / "hero-monument.png", optimize=True)
    monument.save(ASSETS / "hero-eye.png", optimize=True)
    print(f"hero-monument.png  {monument.size}")

    # ── Cards row ──
    cbox = box_to_pixels(CARDS_BOX, w, h)
    cards_row = base.crop(cbox)
    px = cards_row.load()
    w_row, h_row = cards_row.size
    card_zone_h = int(h_row * 0.62)
    col_sum = [0] * w_row
    for x in range(w_row):
        for y in range(card_zone_h):
            r, g, b = px[x, y]
            col_sum[x] += max(r, g, b)
    thr = max(col_sum) * 0.15
    content_cols = [i for i, v in enumerate(col_sum) if v > thr]
    trim_left, trim_right = content_cols[0], content_cols[-1] + 1
    cards_row = cards_row.crop((trim_left, 0, trim_right, h_row))
    cards_row.save(ASSETS / "hero-cards-strip.png", optimize=True)
    print(f"hero-cards-strip.png  {cards_row.size}")

    slice_w = cards_row.width / CARD_COUNT
    for i in range(CARD_COUNT):
        x0 = int(i * slice_w)
        x1 = int((i + 1) * slice_w) if i < CARD_COUNT - 1 else cards_row.width
        card = cards_row.crop((x0, 0, x1, h_row))
        name = f"hero-card-{i + 1:02d}.png"
        card.save(ASSETS / name, optimize=True)
        print(f"  {name}  {card.size}")

    print("Done.")


if __name__ == "__main__":
    main()
