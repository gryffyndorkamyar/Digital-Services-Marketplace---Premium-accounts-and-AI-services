"""Extract Archive 01 figure PNGs from the retail lineup sheet (10character.png)."""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / "frontend/public/brand"
OUT = BRAND / "archive"
OUT.mkdir(parents=True, exist_ok=True)

LINEUP = BRAND / "10character.png"

# Absolute crop boxes on the 1536×1024 lineup (x0, y0, x1, y1).
FIGURE_BOXES: dict[str, tuple[int, int, int, int]] = {
    "01": (12, 14, 297, 378),
    "02": (319, 14, 604, 358),
    "03": (626, 14, 911, 358),
    "04": (933, 14, 1218, 358),
    "05": (1240, 16, 1526, 368),
    "06": (12, 532, 297, 862),
    "07": (334, 532, 592, 862),
    "08": (626, 532, 911, 862),
    "09": (933, 532, 1218, 862),
    "10": (1240, 532, 1526, 862),
}

KEEP_SATELLITES = {"01", "06", "07", "08", "09", "10"}

FLOOD_TOLERANCE: dict[str, int] = {}


@dataclass(frozen=True)
class FigureCrop:
    inset_x: float = 0.12
    inset_top: float = 0.05
    body_bottom: float = 0.70
    keep_satellites: bool = False


def flood_background(im: Image.Image, tolerance: int = 40) -> Image.Image:
    rgba = im.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()

    # Pedestal plate lives in the last ~6% of each retail cell crop.
    cut = int(h * 0.94)
    for y in range(cut, h):
        for x in range(w):
            px[x, y] = (0, 0, 0, 0)

    seeds: list[tuple[int, int]] = []
    step = max(1, min(w, h) // 20)
    for x in range(0, w, step):
        seeds.extend([(x, 0), (x, h - 1)])
    for y in range(0, h, step):
        seeds.extend([(0, y), (w - 1, y)])

    for sx, sy in seeds:
        if px[sx, sy][3] > 0:
            ImageDraw.floodfill(rgba, (sx, sy), (0, 0, 0, 0), thresh=tolerance)

    return rgba


def keep_components(alpha: np.ndarray, keep_satellites: bool) -> np.ndarray:
    labeled, count = ndimage.label(alpha > 0)
    if count == 0:
        return alpha

    areas = ndimage.sum(alpha > 0, labeled, range(1, count + 1))
    order = np.argsort(areas)[::-1]
    main_label = int(order[0]) + 1
    keep = labeled == main_label

    if keep_satellites and count > 1:
        ys, xs = np.where(labeled == main_label)
        bx0, bx1 = xs.min(), xs.max()
        by0, by1 = ys.min(), ys.max()
        pad = max(14, int(max(bx1 - bx0, by1 - by0) * 0.24))
        main_area = areas[order[0]]
        for idx in order[1:]:
            lbl = int(idx) + 1
            if areas[idx] < main_area * 0.007:
                continue
            cy, cx = ndimage.center_of_mass(labeled == lbl)
            if bx0 - pad <= cx <= bx1 + pad and by0 - pad <= cy <= by1 + pad:
                keep |= labeled == lbl

    out = np.zeros_like(alpha)
    out[keep] = 255
    return out


def defringe(rgba: np.ndarray) -> np.ndarray:
    h, w = rgba.shape[:2]
    rgb = rgba[:, :, :3].astype(np.float32)
    alpha = rgba[:, :, 3].astype(np.float32)

    corners = np.array(
        [rgb[0, 0], rgb[0, w - 1], rgb[h - 1, 0], rgb[h - 1, w - 1]],
        dtype=np.float32,
    )
    bg = np.median(corners, axis=0)
    diff = np.linalg.norm(rgb - bg, axis=2)

    fringe = (alpha > 0) & (alpha < 160) & (diff < 36)
    rgba[fringe, 3] = 0
    return rgba


def refine_alpha(alpha: np.ndarray) -> np.ndarray:
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    cleaned = cv2.morphologyEx(alpha, cv2.MORPH_CLOSE, kernel, iterations=1)
    blur = cv2.GaussianBlur(cleaned, (5, 5), 0)
    _, solid = cv2.threshold(blur, 44, 255, cv2.THRESH_BINARY)
    solid = cv2.erode(solid, kernel, iterations=1)
    return cv2.GaussianBlur(solid, (3, 3), 0)


def trim_rgba(rgba: np.ndarray, pad: int = 10) -> np.ndarray:
    alpha = rgba[:, :, 3]
    ys, xs = np.where(alpha > 40)
    if len(xs) == 0:
        return rgba
    x0, x1 = xs.min(), xs.max()
    y0, y1 = ys.min(), ys.max()
    return rgba[
        max(0, y0 - pad) : min(rgba.shape[0], y1 + pad + 1),
        max(0, x0 - pad) : min(rgba.shape[1], x1 + pad + 1),
    ]


def normalize_height(img: Image.Image, target: int = 960) -> Image.Image:
    if img.height <= target:
        return img
    ratio = target / img.height
    return img.resize((max(1, int(img.width * ratio)), target), Image.Resampling.LANCZOS)


def extract_figure(code: str, lineup: Image.Image) -> Image.Image:
    box = FIGURE_BOXES[code]
    crop = lineup.crop(box)
    tol = FLOOD_TOLERANCE.get(code, 42)
    rgba = flood_background(crop, tolerance=tol)

    arr = np.array(rgba)
    alpha = arr[:, :, 3]
    alpha = keep_components(alpha, code in KEEP_SATELLITES)
    alpha = refine_alpha(alpha)
    arr[:, :, 3] = alpha
    arr = defringe(arr)
    arr = trim_rgba(arr, pad=10)
    return normalize_height(Image.fromarray(arr, "RGBA"), 960)


def main() -> None:
    if not LINEUP.exists():
        raise SystemExit(f"Missing lineup source: {LINEUP}")

    lineup = Image.open(LINEUP).convert("RGB")
    print(f"Source {LINEUP.name}: {lineup.size}")

    for code in [f"{i:02d}" for i in range(1, 11)]:
        hero = extract_figure(code, lineup)
        out_path = OUT / f"figure-{code}.png"
        hero.save(out_path, optimize=True)
        opaque = sum(1 for px in hero.getdata() if px[3] > 40)
        total = hero.width * hero.height
        print(f"  figure-{code}.png  {hero.size}  opaque={opaque / total:.1%}")

    print("Done.")


if __name__ == "__main__":
    main()
