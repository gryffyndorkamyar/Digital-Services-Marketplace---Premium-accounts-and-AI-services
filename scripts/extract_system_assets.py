"""Extract OVYRA system section assets from section2image.png."""
from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "frontend/public/brand/section2image.png"
OUT = ROOT / "frontend/public/brand/system"
OUT.mkdir(parents=True, exist_ok=True)

# Detected via purple-neon cluster analysis on 1536×1024 source
REGIONS = {
    "lore-card": (0.18359375, 0.5087890625, 0.3984375, 0.83984375),
    "puzzle-piece": (0.763671875, 0.251953125, 0.880859375, 0.6103515625),
    "figure-totem": (0.468, 0.285, 0.658, 0.572),
}


def is_background(r: int, g: int, b: int, threshold: int = 218) -> bool:
    lum = (r + g + b) / 3
    spread = max(abs(r - g), abs(g - b), abs(r - b))
    if lum >= threshold and spread <= 26:
        return True
    if 198 <= lum <= 252 and spread <= 14:
        return True
    return False


def flood_remove_background(img: Image.Image, threshold: int = 218) -> Image.Image:
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

    while q:
        x, y = q.popleft()
        if x < 0 or y < 0 or x >= w or y >= h or visited[y, x]:
            continue
        visited[y, x] = True
        r, g, b, a = arr[y, x]
        if a == 0 or not is_background(int(r), int(g), int(b), threshold):
            continue
        arr[y, x, 3] = 0
        q.append((x + 1, y))
        q.append((x - 1, y))
        q.append((x, y + 1))
        q.append((x, y - 1))

    # second pass: stray light fringe pixels adjacent to transparency
    alpha = arr[:, :, 3]
    transparent = alpha == 0
    dilated = transparent.copy()
    for _ in range(2):
        pad = np.pad(dilated, 1, mode="constant", constant_values=False)
        dilated = (
            pad[0:-2, 1:-1]
            | pad[2:, 1:-1]
            | pad[1:-1, 0:-2]
            | pad[1:-1, 2:]
            | pad[1:-1, 1:-1]
        )
    fringe = dilated & (alpha > 0)
    for y, x in zip(*np.where(fringe)):
        r, g, b = arr[y, x, :3]
        if is_background(int(r), int(g), int(b), threshold - 8):
            arr[y, x, 3] = 0

    out = Image.fromarray(arr, "RGBA")
    alpha = out.split()[3].filter(ImageFilter.GaussianBlur(radius=0.5))
    out.putalpha(alpha)
    return out


def crop_fraction(img: Image.Image, box: tuple[float, float, float, float]) -> Image.Image:
    w, h = img.size
    x0, y0, x1, y1 = box
    return img.crop((int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h)))


def cleanup_alpha(img: Image.Image) -> Image.Image:
    arr = np.array(img.convert("RGBA"), dtype=np.uint8)
    alpha = arr[:, :, 3]
    lum = (arr[:, :, 0].astype(np.int16) + arr[:, :, 1].astype(np.int16) + arr[:, :, 2].astype(np.int16)) / 3
    spread = np.maximum.reduce(
        [
            np.abs(arr[:, :, 0].astype(np.int16) - arr[:, :, 1].astype(np.int16)),
            np.abs(arr[:, :, 1].astype(np.int16) - arr[:, :, 2].astype(np.int16)),
            np.abs(arr[:, :, 0].astype(np.int16) - arr[:, :, 2].astype(np.int16)),
        ]
    )

    arr[alpha < 28, 3] = 0
    arr[(alpha > 0) & (alpha < 48) & (lum >= 175), 3] = 0

    # aggressive top-left fringe removal (visible white spot on box spine)
    h, w = arr.shape[:2]
    fringe_h, fringe_w = min(140, h), min(160, w)
    region = arr[:fringe_h, :fringe_w]
    r_lum = (region[:, :, 0].astype(np.int16) + region[:, :, 1].astype(np.int16) + region[:, :, 2].astype(np.int16)) / 3
    r_spread = np.maximum.reduce(
        [
            np.abs(region[:, :, 0].astype(np.int16) - region[:, :, 1].astype(np.int16)),
            np.abs(region[:, :, 1].astype(np.int16) - region[:, :, 2].astype(np.int16)),
            np.abs(region[:, :, 0].astype(np.int16) - region[:, :, 2].astype(np.int16)),
        ]
    )
    kill = (region[:, :, 3] > 0) & (r_lum >= 130) & (r_spread <= 40)
    region[kill, 3] = 0
    arr[:fringe_h, :fringe_w] = region

    # diagonal wedge near top-left corner
    for y in range(min(180, h)):
        for x in range(min(200, w)):
            if x + y > 210:
                continue
            r, g, b, a = arr[y, x]
            if a == 0:
                continue
            lum = (int(r) + int(g) + int(b)) / 3
            spread = max(abs(int(r) - int(g)), abs(int(g) - int(b)), abs(int(r) - int(b)))
            if lum >= 120 and spread <= 45:
                arr[y, x, 3] = 0

    return Image.fromarray(arr, "RGBA")


def trim_alpha(img: Image.Image, pad: int = 2) -> Image.Image:
    arr = np.array(img)
    alpha = arr[:, :, 3]
    ys, xs = np.where(alpha > 32)
    if len(xs) == 0:
        ys, xs = np.where(np.any(arr[:, :, :3] < 250, axis=2))
    if len(xs) == 0:
        return img
    x0, x1 = xs.min(), xs.max()
    y0, y1 = ys.min(), ys.max()
    return img.crop((max(0, x0 - pad), max(0, y0 - pad), min(img.width, x1 + pad + 1), min(img.height, y1 + pad + 1)))


def main() -> None:
    src = Image.open(SRC)
    print(f"Source {SRC.name}: {src.size}")

    clean_full = flood_remove_background(src, threshold=214)
    clean_full = cleanup_alpha(clean_full)

    # Sub-assets: crop from original for pixel-perfect fidelity (inside box = opaque)
    for name, box in REGIONS.items():
        crop = crop_fraction(src, box)
        path = OUT / f"{name}.png"
        crop.save(path, optimize=True)
        print(f"  {path.name}  {crop.size}")

    hero = trim_alpha(clean_full, pad=4)
    hero_path = OUT / "box-open.png"
    hero.save(hero_path, optimize=True)
    print(f"  box-open.png  {hero.size}")
    print("Done.")


if __name__ == "__main__":
    main()
