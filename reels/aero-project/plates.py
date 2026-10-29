import cv2,numpy as np,sys
V='/root/.claude/uploads/b61889c1-908b-58df-be38-296f2cfb4b99/fae7e0c1-Aero_Project_Reel_3.mp4'
cap=cv2.VideoCapture(V);frames={}
want={8:'front',128:'wings',248:'appendix',368:'side',458:'part',578:'full'}
i=0
while True:
    ok,f=cap.read()
    if not ok:break
    if i in want: frames[want[i]]=f
    i+=1
Y0=240
common=[(0,0,620,30),(40,40,900,210),(50,1300,1030,1440)]
extra={'front':[],
 'wings':[(60,1085,460,1145),(210,640,330,760),(690,640,810,760)],
 'appendix':[(80,1075,930,1130),(560,840,930,1120)],
 'side':[(100,540,420,630),(40,690,1040,960),(60,1115,560,1170)],
 'part':[(60,1140,620,1195)],
 'full':[]}
for k,f in frames.items():
    p=f[Y0:Y0+1440].copy()
    b,g,r=[p[...,c].astype(int) for c in range(3)]
    white=(np.minimum(np.minimum(b,g),r)>150)
    cyan=(g>120)&(b>120)&(r<140)&(g-r>50)
    m=np.zeros(p.shape[:2],np.uint8)
    for (x0,y0,x1,y1) in common+extra[k]:
        sub=(white|cyan)[y0:y1,x0:x1]
        m[y0:y1,x0:x1][sub]=255
    m=cv2.dilate(m,np.ones((9,9),np.uint8))
    out=cv2.inpaint(p,m,9,cv2.INPAINT_TELEA)
    cv2.imwrite(f'plate_{k}.png',out); cv2.imwrite(f'raw_{k}.png',p)
print(sorted(frames))
