"""Measure the approved board's dot centres, sizes and colours; never edit it."""
import json
from pathlib import Path
import cv2
import numpy as np
from skimage.feature import peak_local_max

root = Path(__file__).resolve().parents[1]
source = root / 'design/footer-color-current-v1/01-color-sequence.png'
image = cv2.cvtColor(cv2.imread(str(source)), cv2.COLOR_BGR2RGB)
crop = image[140:580, 145:1025]
rgb = crop.astype(float)
ink = ((rgb.mean(axis=2) < 175) | ((rgb.max(axis=2)-rgb.min(axis=2)) > 65)).astype('uint8')
distance = cv2.distanceTransform(ink, cv2.DIST_L2, 5)
centres = peak_local_max(distance, min_distance=3, threshold_abs=1, exclude_border=False)
dots = []
for cy, cx in centres:
    radius = max(.65, float(distance[cy,cx])-.25)
    if radius > 11: continue
    extent = max(1,int(radius*.45))
    colour = np.median(crop[max(0,cy-extent):cy+extent+1,max(0,cx-extent):cx+extent+1].reshape(-1,3),axis=0)
    # The board's actual artwork occupies x=145..1025, y=140..580.
    dots.append([round(40+cx*.93,3), round(84+cy*.93,3), round(radius*.93,3), *[int(v) for v in colour]])
(root/'lib/current-reference.json').write_text(json.dumps(dots,separators=(',',':')))
print(json.dumps({'dots':len(dots),'source':str(source)}))
