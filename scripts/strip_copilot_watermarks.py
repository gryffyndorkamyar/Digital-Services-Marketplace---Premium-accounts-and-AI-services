"""Remove the Copilot 'Made with AI' badge from archive figure PNGs."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

BRAND = Path(__file__).resolve().parents[1] / "frontend/public/brand"


def remove_watermark(path: Path) -> None:
    im = Image.open(path).convert("RGBA")
    rgba = np.array(im)
    h, w = rgba.shape[:2]

    x0 = int(w * 0.78)
    y1 = int(h * 0.13)
    zone = rgba[:y1, x0:].copy()
    rgb = zone[:, :, :3].astype(np.float32)
    lum = rgb.max(axis=2)

    # Badge + text on black: wipe any non-background pixel in the corner band.
    wipe = lum > 22
    zone[wipe, 3] = 0
    zone[wipe, :3] = 0
    rgba[:y1, x0:] = zone

    im_out = Image.fromarray(rgba, "RGBA")
    im_out.save(path, optimize=True)
    print(f"  cleaned {path.name}")


def main() -> None:
    files = sorted(BRAND.glob("Copilot_*.png"))
    if not files:
        raise SystemExit("No Copilot PNGs found.")

    print(f"Cleaning {len(files)} files...")
    for path in files:
        remove_watermark(path)
    print("Done.")


if __name__ == "__main__":
    main()
