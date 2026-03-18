from PIL import Image
import numpy as np
from scipy import ndimage

img = Image.open('public/assets/images/map-real.jpg').convert('RGB')
arr = np.array(img)
h, w = arr.shape[:2]

sx = 880 / w
sy = 600 / h

print(f"Image: {w}x{h}  SVG scale: sx={sx:.4f} sy={sy:.4f}")
print()

r, g, b = arr[:,:,0].astype(int), arr[:,:,1].astype(int), arr[:,:,2].astype(int)

hsv = img.convert('HSV')
ha = np.array(hsv)
hue = ha[:,:,0].astype(int)
sat = ha[:,:,1].astype(int)
val = ha[:,:,2].astype(int)

# Цветные пиксели (не бумага, не чёрный, медиум насыщенность)
colored = (sat > 25) & (val > 90) & ~((r>195) & (g>185) & (b>165))

# 10 участков по доминирующему оттенку + синий пятна моря
# PIL HSV hue 0..255: red=0/255, yellow=43, green=85, cyan=128, blue=170, magenta=213
district_hues = {
    'Участок №1 (зелёный)':      (72, 100, 'rgba(140,200,120,0.55)', 'rgba(100,170,80,0.75)'),
    'Участок №2 (оранжевый)':    (10, 30,  'rgba(255,180,110,0.55)', 'rgba(225,140,70,0.75)'),
    'Участок №3 (жёлто-зелёный)':(45, 72,  'rgba(200,220,120,0.55)', 'rgba(165,195,80,0.75)'),
    'Участок №4 (жёлтый)':       (30, 48,  'rgba(240,220,100,0.55)', 'rgba(210,185,50,0.75)'),
    'Участок №5 (голубой)':      (135,165, 'rgba(100,155,225,0.50)', 'rgba(60,115,195,0.72)'),
    'Участок №6 (персиковый)':   (5,  18,  'rgba(240,190,150,0.55)', 'rgba(215,150,100,0.75)'),
    'Участок №7 (розовый)':      (215,255, 'rgba(225,170,185,0.55)', 'rgba(195,125,150,0.75)'),
    'Участок №8 (сиреневый)':    (185,218, 'rgba(195,175,220,0.55)', 'rgba(155,130,200,0.75)'),
    'Участок №9 (розово-беж)':   (3,  12,  'rgba(240,195,180,0.55)', 'rgba(210,150,135,0.75)'),
}

print("--- Bounding boxes по цвету (SVG координаты) ---")
for label, info in district_hues.items():
    h_lo, h_hi = info[0], info[1]
    mask = colored & (hue >= h_lo) & (hue <= h_hi)
    px = np.where(mask)
    n = len(px[0])
    if n < 300:
        print(f"  {label}: слишком мало пикселей ({n}), пропущен")
        continue
    ys, xs = px
    x0,x1 = xs.min(), xs.max()
    y0,y1 = ys.min(), ys.max()
    cx = int((x0+x1)/2 * sx)
    cy = int((y0+y1)/2 * sy)
    # Примерный полигон из 8 точек на равных интервалах по контуру bbox
    bx0,bx1 = round(x0*sx), round(x1*sx)
    by0,by1 = round(y0*sy), round(y1*sy)
    print(f"  {label}")
    print(f"    img bbox: [{x0},{y0}]-[{x1},{y1}]  pixels={n}")
    print(f"    SVG bbox: [{bx0},{by0}]-[{bx1},{by1}]  center=({cx},{cy})")
    print()

# Дополнительно — найдём центры крупных связных компонент для каждого цвета
print()
print("--- Центры связных компонент (для точного размещения маркеров) ---")
all_district = colored & (sat > 35)

for label, info in district_hues.items():
    h_lo, h_hi = info[0], info[1]
    mask = colored & (hue >= h_lo) & (hue <= h_hi)
    labeled, num = ndimage.label(mask)
    if num == 0:
        continue
    # Берём компоненту с наибольшим количеством пикселей
    sizes = ndimage.sum(mask, labeled, range(1, num+1))
    biggest = int(np.argmax(sizes)) + 1
    comp = labeled == biggest
    ys, xs = np.where(comp)
    cx = int(xs.mean() * sx)
    cy = int(ys.mean() * sy)
    print(f"  {label}: main_component center = ({cx}, {cy}), size={int(sizes[biggest-1])}")
