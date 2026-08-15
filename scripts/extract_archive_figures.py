"""Extract Archive 01 hero PNGs from WhatsApp character sheets."""
from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / "frontend/public/brand"
OUT = BRAND / "archive"
OUT.mkdir(parents=True, exist_ok=True)

# code -> (source filename, crop box as fractions x0,y0,x1,y1 or None for full frame)
FIGURES: dict[str, tuple[str, tuple[float, float, float, float] | None]] = {
    "01": ("WhatsApp Image 2026-08-15 at 07.45.53.jpeg", (0.02, 0.03, 0.34, 0.5)),
    "02": ("WhatsApp Image 2026-08-15 at 07.45.53 (1).jpeg", (0.02, 0.03, 0.27, 0.52)),
    "03": ("WhatsApp Image 2026-08-15 at 07.45.53 (2).jpeg", (0.02, 0.03, 0.27, 0.52)),
    "04": ("WhatsApp Image 2026-08-15 at 07.45.54.jpeg", (0.02, 0.03, 0.26, 0.31)),
    "05": ("WhatsApp Image 2026-08-15 at 07.45.54 (1).jpeg", (0.02, 0.03, 0.26, 0.31)),
    "06": ("WhatsApp Image 2026-08-15 at 07.45.54 (2).jpeg", (0.02, 0.03, 0.26, 0.31)),
    "07": ("WhatsApp Image 2026-08-15 at 07.45.55.jpeg", (0.02, 0.03, 0.21, 0.38)),
    "08": ("WhatsApp Image 2026-08-15 at 07.45.55 (1).jpeg", (0.02, 0.03, 0.21, 0.42)),
    "09": ("WhatsApp Image 2026-08-15 at 07.45.58.jpeg", (0.02, 0.03, 0.21, 0.35)),
    "10": ("WhatsApp Image 2026-08-15 at 07.45.59.jpeg", None),
}


def is_light_bg(r: int, g: int, b: int, threshold: int = 218) -> bool:
    lum = (r + g + b) / 3
    spread = max(abs(r - g), abs(g - b), abs(r - b))
    if lum >= threshold and spread <= 26:
        return True
    if 198 <= lum <= 252 and spread <= 14:
        return True
    return False


def is_dark_bg(r: int, g: int, b: int, threshold: int = 42) -> bool:
    lum = (r + g + b) / 3
    spread = max(abs(r - g), abs(g - b), abs(r - b))
    return lum <= threshold and spread <= 28


def flood_remove(
    img: Image.Image,
    *,
    light: bool = False,
    dark: bool = False,
) -> Image.Image:
    rgba = img.convert("RGBA")
    arr = np.array(rgba, dtype=np.uint8)
    h, w = arr.shape[:2]
    visited = np.zeros((h, w), dtype=bool)
    q: deque[tuple[int, int]] = deque()

    for x in range(w):
        q.append((x, 0))
        q.append((x, h - 1))
    for y in range(h):
        q.append((0, y))
        q.append((w - 1, y))

    def matches(r: int, g: int, b: int) -> bool:
        if light and is_light_bg(r, g, b):
            return True
        if dark and is_dark_bg(r, g, b):
            return True
        return False

    while q:
        x, y = q.popleft()
        if x < 0 or y < 0 or x >= w or y >= h or visited[y, x]:
            continue
        visited[y, x] = True
        r, g, b, a = arr[y, x]
        if a == 0 or not matches(int(r), int(g), int(b)):
            continue
        arr[y, x, 3] = 0
        q.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])

    out = Image.fromarray(arr, "RGBA")
    alpha = out.split()[3].filter(ImageFilter.GaussianBlur(radius=0.6))
    out.putalpha(alpha)
    return out


def crop_fraction(img: Image.Image, box: tuple[float, float, float, float]) -> Image.Image:
    w, h = img.size
    x0, y0, x1, y1 = box
    return img.crop((int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h)))


def trim_alpha(img: Image.Image, pad: int = 4) -> Image.Image:
    arr = np.array(img)
    alpha = arr[:, :, 3]
    ys, xs = np.where(alpha > 36)
    if len(xs) == 0:
        return img
    x0, x1 = xs.min(), xs.max()
    y0, y1 = ys.min(), ys.max()
    return img.crop(
        (
            max(0, x0 - pad),
            max(0, y0 - pad),
            min(img.width, x1 + pad + 1),
            min(img.height, y1 + pad + 1),
        )
    )


def normalize_height(img: Image.Image, target: int = 720) -> Image.Image:
    if img.height <= target:
        return img
    ratio = target / img.height
    return img.resize((max(1, int(img.width * ratio)), target), Image.Resampling.LANCZOS)


def main() -> None:
    for code, (filename, box) in FIGURES.items():
        src_path = BRAND / filename
        if not src_path.exists():
            print(f"MISSING {filename}")
            continue

        img = Image.open(src_path)
        crop = img if box is None else crop_fraction(img, box)

        # white studio sheets vs black backdrop sheets
        sample = np.array(crop.convert("RGB").resize((32, 32)))
        mean_lum = sample.mean()
        if mean_lum > 140:
            cleaned = flood_remove(crop, light=True)
        else:
            cleaned = flood_remove(crop, dark=True)

        hero = trim_alpha(cleaned, pad=6)
        hero = normalize_height(hero, 680)
        out_path = OUT / f"figure-{code}.png"
        hero.save(out_path, optimize=True)
        print(f"  figure-{code}.png  {hero.size}  <- {filename}")

    print("Done.")


if __name__ == "__main__":
    main()
