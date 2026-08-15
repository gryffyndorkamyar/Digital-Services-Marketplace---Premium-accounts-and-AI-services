"""Extract transparent chain PNG from chain.png (checkerboard + watermark cleanup)."""
from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "frontend/public/brand/chain.png"
OUT_DIR = ROOT / "frontend/public/brand/system"
OUT_DIR.mkdir(parents=True, exist_ok=True)


def is_bg(r: int, g: int, b: int, threshold: int = 200) -> bool:
    lum = (r + g + b) / 3
    spread = max(abs(r - g), abs(g - b), abs(r - b))
    if lum <= 42 and spread <= 24:
        return True
    if lum >= threshold and spread <= 28:
        return True
    if 185 <= lum <= 255 and spread <= 16:
        return True
    return False


def is_watermark(r: int, g: int, b: int) -> bool:
    lum = (r + g + b) / 3
    spread = max(abs(r - g), abs(g - b), abs(r - b))
    return 160 <= lum <= 240 and spread <= 18


def flood_bg(img: Image.Image) -> Image.Image:
    arr = np.array(img.convert("RGBA"), dtype=np.uint8)
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
        r, g, b, a = (int(arr[y, x, 0]), int(arr[y, x, 1]), int(arr[y, x, 2]), int(arr[y, x, 3]))
        if a == 0:
            continue
        if is_bg(r, g, b) or is_watermark(r, g, b):
            arr[y, x, 3] = 0
            q.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])

    # keep gold/bronze chain pixels; drop remaining flat grays inside bbox
    lum = (arr[:, :, 0].astype(np.int16) + arr[:, :, 1].astype(np.int16) + arr[:, :, 2].astype(np.int16)) / 3
    spread = np.maximum.reduce(
        [
            np.abs(arr[:, :, 0].astype(np.int16) - arr[:, :, 1].astype(np.int16)),
            np.abs(arr[:, :, 1].astype(np.int16) - arr[:, :, 2].astype(np.int16)),
            np.abs(arr[:, :, 0].astype(np.int16) - arr[:, :, 2].astype(np.int16)),
        ]
    )
    flat = (arr[:, :, 3] > 0) & (lum >= 145) & (spread <= 22)
    arr[flat, 3] = 0
    dark = (arr[:, :, 3] > 0) & (lum <= 48) & (spread <= 20)
    arr[dark, 3] = 0

    arr[arr[:, :, 3] < 24, 3] = 0
    out = Image.fromarray(arr, "RGBA")
    alpha = out.split()[3].filter(ImageFilter.GaussianBlur(radius=0.4))
    out.putalpha(alpha)
    return out


def trim_alpha(img: Image.Image, pad: int = 4) -> Image.Image:
    arr = np.array(img)
    ys, xs = np.where(arr[:, :, 3] > 32)
    if len(xs) == 0:
        return img
    x0, x1 = xs.min(), xs.max()
    y0, y1 = ys.min(), ys.max()
    return img.crop((max(0, x0 - pad), max(0, y0 - pad), min(img.width, x1 + pad + 1), min(img.height, y1 + pad + 1)))


def main() -> None:
    src = Image.open(SRC)
    print(f"Source {SRC.name}: {src.size}")

    clean = trim_alpha(flood_bg(src))
    full_path = OUT_DIR / "chain-link.png"
    clean.save(full_path, optimize=True)
    print(f"  chain-link.png  {clean.size}")

    # shorter segment (middle links) for tight gaps
    w, h = clean.size
    segment = clean.crop((int(w * 0.18), 0, int(w * 0.82), h))
    segment = trim_alpha(segment, pad=2)
    seg_path = OUT_DIR / "chain-segment.png"
    segment.save(seg_path, optimize=True)
    print(f"  chain-segment.png  {segment.size}")
    print("Done.")


if __name__ == "__main__":
    main()
