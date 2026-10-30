#!/bin/bash
# Pass "cinematografico" sopra l'edit BMW (uscita di tools/bmw_edit.sh):
# bande 2.39:1 che entrano alla fine della prima inquadratura, halation calda sulle luci, flare anamorfici orizzontali, arancio selettivo,
# flash sul drop, aberrazione cromatica leggera e grana da pellicola.
#   tools/bmw_cinema.sh edit_bmw.mp4 edit_bmw_cinema.mp4
set -e
IN="$1"; OUT="${2:-edit_bmw_cinema.mp4}"
# intensità regolabili da fuori: HAL (halation), STREAK (flare), GRAIN
HAL=${HAL:-0.6}; STREAK=${STREAK:-3.0}; GRAIN=${GRAIN:-7}
B=138   # altezza delle bande: 2.39:1 dentro 1920x1080
# le bande entrano scorrendo alla fine della prima inquadratura (1.45-2.05 s), come l'apertura di un film
K="clip((t-1.45)/0.6\,0\,1)"; E="($K*$K*(3-2*$K))"
# flash di esposizione (le luci esplodono, i neri restano neri) sul colpo dopo la pausa e sull'ingresso del logo
FLASH="1.0*max(0\,1-abs(T-8.0)/0.15)+0.5*max(0\,1-abs(T-10.88)/0.2)"
FC="[0:v]format=gbrp,huesaturation=saturation=0.55:colors=r+y,split=3[b][h][s];
[h]curves=all='0/0 0.5/0 1/1',gblur=sigma=22,colorchannelmixer=rr=1.0:gg=0.42:bb=0.22[hal];
[s]curves=all='0/0 0.62/0 1/1',scale=960:540,avgblur=sizeX=90:sizeY=1,avgblur=sizeX=45:sizeY=1,scale=1920:1080,colorchannelmixer=rr=0.25:gg=0.55:bb=1.0,lutrgb=r='val*$STREAK':g='val*$STREAK':b='val*$STREAK'[str];
[b][hal]blend=all_mode=screen:all_opacity=$HAL[x];[x][str]blend=all_expr='min(255\,(255-(255-A)*(255-B)/255)*(1+$FLASH))'[y];
[y]format=yuv444p,rgbashift=rh=-2:bh=2,noise=c0s=$GRAIN:c0f=t+u,split[m][d];
[d]crop=1920:1080-2*$B:0:20,pad=1920:1080:0:$B[dd];
[m][dd]overlay=enable='between(t\,5.95\,7.75)'[m1];
color=black:s=1920x$B:r=48[tb];color=black:s=1920x$B:r=48[bb];
[m1][tb]overlay=y='-$B+$B*$E':eval=frame:shortest=1[m2];
[m2][bb]overlay=y='1080-$B*$E':eval=frame:shortest=1,format=yuv420p[v]"
ffmpeg -y -v error ${SEEK:+-ss $SEEK} -i "$IN" -filter_complex "$FC" -map "[v]" -map 0:a? ${FRAMES:+-frames:v $FRAMES} \
  -c:v libx264 -preset slow -tune film -crf 14 -c:a copy -movflags +faststart "$OUT"
echo "Fatto: $OUT"
