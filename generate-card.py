#!/usr/bin/env python3
"""Generate a WeChat share card image for the wedding invitation.
   Two versions: text-only elegant card + photo-background card.
   Output: photos/share-card.png (1200×630, optimized for WeChat)
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os, math

# ── Paths ──────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PHOTOS_DIR = os.path.join(BASE_DIR, "photos")
OUTPUT_PATH = os.path.join(PHOTOS_DIR, "share-card.png")
PHOTO_PATH  = os.path.join(PHOTOS_DIR, "IMG_8146.JPG")

# ── macOS fonts ────────────────────────────────────────
SONGTI   = "/System/Library/Fonts/Supplemental/Songti.ttc"
KAITI    = "/System/Library/AssetsV2/com_apple_MobileAsset_Font8/88d6cc32a907955efa1d014207889413890573be.asset/AssetData/Kaiti.ttc"
GEORGIA  = "/System/Library/Fonts/Supplemental/Georgia.ttf"
GEORGIAB = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"

# ── Dimensions ─────────────────────────────────────────
W, H = 1200, 630

# ── Colors ─────────────────────────────────────────────
CREAM     = (247, 242, 234)
GOLD      = (184, 160, 122)
GOLD_DIM  = (160, 138, 105)
DARK      = (61,  53,  54)
WARM      = (107, 94,  90)
WHITE_SOFT_FG = (252, 250, 245)

# ── Font helpers ───────────────────────────────────────
def load_font(path, size, index=0):
    try:
        return ImageFont.truetype(path, size, index=index)
    except Exception:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            return ImageFont.load_default()

font_label   = load_font(GEORGIA, 24)
font_names   = load_font(SONGTI, 50, index=0)   # Songti SC Black - 标题
font_amp     = load_font(KAITI, 34)
font_detail  = load_font(SONGTI, 20, index=6)   # Songti SC Regular - 副标题
font_ven     = load_font(SONGTI, 18, index=6)
font_footer  = load_font(GEORGIAB, 15)

# ── Text helpers ───────────────────────────────────────
def tw(draw, text, font):
    b = draw.textbbox((0, 0), text, font=font)
    return b[2] - b[0]
def th(draw, text, font):
    b = draw.textbbox((0, 0), text, font=font)
    return b[3] - b[1]

def dc(draw, y, text, font, color, spacing=0):
    """Draw centered text, return bottom y."""
    if spacing and len(text) > 1:
        w = sum(tw(draw, ch, font) for ch in text) + spacing * (len(text) - 1)
        x = (W - w) // 2
        ht = th(draw, text[0], font)
        for ch in text:
            draw.text((x, y), ch, font=font, fill=color)
            x += tw(draw, ch, font) + spacing
        return y + ht
    w, ht = tw(draw, text, font), th(draw, text, font)
    draw.text(((W - w) // 2, y), text, font=font, fill=color)
    return y + ht

def dline(draw, x1, x2, y, color, w=1):
    draw.line([(x1, y), (x2, y)], fill=color, width=w)

# ═══════════════════════════════════════════════════════
# VERSION: Photo background with semi-transparent overlay
# ═══════════════════════════════════════════════════════

# Load and process background photo
photo = Image.open(PHOTO_PATH).convert("RGB")

# Crop to landscape ratio (center crop)
pw, ph = photo.size
target_ratio = W / H
if pw / ph > target_ratio:
    # Photo is wider → crop width
    new_w = int(ph * target_ratio)
    left = (pw - new_w) // 2
    photo = photo.crop((left, 0, left + new_w, ph))
else:
    # Photo is taller → crop height
    new_h = int(pw / target_ratio)
    top = (ph - new_h) // 2
    photo = photo.crop((0, top, pw, top + new_h))

photo = photo.resize((W, H), Image.LANCZOS)

# Soften the photo for text overlay
photo = photo.filter(ImageFilter.GaussianBlur(radius=3))

# Darken and warm the photo
enhancer = ImageEnhance.Brightness(photo)
photo = enhancer.enhance(0.55)  # darker
enhancer = ImageEnhance.Color(photo)
photo = enhancer.enhance(0.7)   # slightly desaturated

# Create overlay gradient (cream at bottom, transparent at top)
overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
for y in range(H):
    # Gradient: more overlay at bottom
    alpha = int(140 + 60 * (1 - y / H))  # 140 at top, 200 at bottom
    alpha = max(0, min(255, alpha))
    for x in range(0, W, 2):
        overlay.putpixel((x, y), (247, 240, 230, alpha))

# Composite
photo_rgba = photo.convert("RGBA")
img_base = Image.alpha_composite(photo_rgba, overlay)
img = img_base.convert("RGB")
draw = ImageDraw.Draw(img)

# ── Frame ──────────────────────────────────────────────
m = 22       # outer margin
mi = 42      # inner margin
draw.rectangle([m, m, W-m, H-m], outline=GOLD, width=1)
draw.rectangle([mi, mi, W-mi, H-mi], outline=GOLD_DIM, width=1)

# ── Corner ornaments ──────────────────────────────────
clen = 32
for cx, cy, sx, sy in [
    (mi, mi, 1, 1), (W-mi, mi, -1, 1),
    (mi, H-mi, 1, -1), (W-mi, H-mi, -1, -1),
]:
    draw.line([cx, cy, cx + sx*clen, cy], fill=GOLD, width=1)
    draw.line([cx, cy, cx, cy + sy*clen], fill=GOLD, width=1)
    r = 2.5
    draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=GOLD)

# ── Content ────────────────────────────────────────────
y = 148

# Top ornament
orn_y = y
cx = W // 2
dline(draw, cx - 72 - 18, cx - 18, orn_y, GOLD)
dc(draw, orn_y - 10, "◆", load_font(SONGTI, 10, index=4), GOLD)
dline(draw, cx + 18, cx + 72 + 18, orn_y, GOLD)
y = orn_y + 28

# Whimsy Feast
dc(draw, y, "W H I M S Y    F E A S T", font_label, GOLD, spacing=4)
y += 28

# Names
name_left = "文浩然"
amp = "&"
name_right = "朱莹"

tw_l = tw(draw, name_left, font_names)
tw_a = tw(draw, amp, font_amp)
tw_r = tw(draw, name_right, font_names)
gap = 28
total_w = tw_l + gap + tw_a + gap + tw_r
nx = (W - total_w) // 2

draw.text((nx, y), name_left, font=font_names, fill=WHITE_SOFT_FG)
draw.text((nx + tw_l + gap, y + 8), amp, font=font_amp, fill=GOLD)
draw.text((nx + tw_l + gap + tw_a + gap, y), name_right, font=font_names, fill=WHITE_SOFT_FG)

y += th(draw, name_left, font_names) + 10

# Subtitle
dc(draw, y, "诚邀您见证我们的婚礼", font_detail, WHITE_SOFT_FG, spacing=3)
y += 34

# Date & venue
dc(draw, y, "2026年7月10日  ·  凯丽瑞丝酒店·天水", font_ven, WHITE_SOFT_FG, spacing=1)
y += 46

# Divider
div_w = 150
dline(draw, cx - div_w, cx - 10, y, GOLD)
dc(draw, y - 9, "◇", load_font(SONGTI, 10, index=4), GOLD)
dline(draw, cx + 10, cx + div_w, y, GOLD)
y += 22

# Footer
dc(draw, y, "YOU ARE CORDIALLY INVITED", font_footer, GOLD, spacing=3)

# Bottom dots
dot_y = H - 50
for i in range(-3, 4):
    r = 2 if i == 0 else 1.5
    draw.ellipse([cx + i*18 - r, dot_y - r, cx + i*18 + r, dot_y + r], fill=GOLD)

# ── Save ───────────────────────────────────────────────
img.save(OUTPUT_PATH, "PNG", optimize=True)
size_kb = os.path.getsize(OUTPUT_PATH) / 1024
print(f"✅ Share card saved to: {OUTPUT_PATH}")
print(f"   Dimensions: {W}×{H}")
print(f"   File size: {size_kb:.1f} KB")
