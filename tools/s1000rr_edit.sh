#!/bin/bash
# Edit cinematografico S1000RR (~23 s) dalle clip 4K/50 fps di "S1000RR Andre video 29.10.2026".
#   tools/s1000rr_edit.sh CARTELLA_CLIP musica.(wav|mp3|mp4) edit_s1000rr.mp4
# Poi: TITLE="S 1 0 0 0 R R" FLASH=... tools/bmw_cinema.sh edit_s1000rr.mp4 edit_s1000rr_cinema.mp4
# Stesso look di tools/bmw_edit.sh (matte freddo, push-in lento, 48 fps interpolati), tagli sulle battute
# della musica allungata a 23 s (brano fino a 11.82 s + ripresa da 2.07 s alla fine): due pause al nero
# (7.0-7.9 e 16.75-17.65) seguite dai drop.
set -e
DIR="$(realpath "$1")"; M="$(realpath "$2")"; OUT="$(realpath -m "${3:-edit_s1000rr.mp4}")"
WORK=$(mktemp -d); trap 'rm -rf "$WORK"' EXIT; cd "$WORK"
FPS=48
c() { awk "BEGIN{printf \"%.4f\", $1}"; }
MI="minterpolate=fps=$FPS:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:me=epzs:vsbmc=1:scd=none:mb_size=16:search_param=32"
ENC="-c:v libx264 -preset slow -tune film -crf 14 -pix_fmt yuv420p"
MATTE="curves=r='0/0.07 0.5/0.47 1/0.9':g='0/0.08 0.5/0.49 1/0.91':b='0/0.085 0.5/0.49 1/0.9',eq=saturation=0.5:contrast=1.05"
LIFT="hqdn3d=2:2:3:3,curves=master='0/0 0.065/0.03 0.11/0.17 0.25/0.50 0.5/0.76 0.8/0.93 1/1'"
SHARP="cas=strength=0.4"
# nome:clip:inizio:durata sorgente:velocità:durata output:fade in:fade out[:fotogrammi di nero dopo[:r = al contrario]]
# A1-A3: la stessa frontale (avvicinamento lento) spezzata in tre e ripresa durante il video
SHOTS=${SHOTS:-"A1:9336:1.50:1.04:0.5:2.07:0.6:0.15
B:9324:2.90:0.98:0.5:1.95:0.15:0.15
A2:9336:2.60:0.98:0.5:1.95:0.15:0.15
D:9360:3.00:2.61:1.6:1.63:0.1:0.4:15:r
E1:9347:1.20:0.78:0.8:0.975:0.08:0.08
E2:9359:1.20:0.78:0.8:0.975:0.08:0.08
E3:9365:2.00:0.78:0.8:0.975:0.08:0.08
E4:9326:1.80:0.78:0.8:0.975:0.08:0.08
S1:9371:0.50:0.98:0.5:1.95:0.15:0.15
A3:9336:4.00:0.98:0.5:1.95:0.15:0.15
L:9357:5.60:0.95:0.6:1.58:0.15:0.5:18
F1:9370:2.30:0.78:0.8:0.975:0.08:0.08
F2:9361:6.00:0.78:0.8:0.975:0.08:0.08
G:9352:1.00:1.31:0.67:1.95:0.2:0.3
H:9338:2.50:1.34:0.9:1.48:0.15:1.0"}
: > list.txt
for s in $SHOTS; do IFS=: read n clip a sd sp od fi fo nero rev <<< "$s"
  echo "Inquadratura $n (DN7A$clip)…"
  pre="scale=1920:1080:flags=lanczos"; [ "$rev" = r ] && pre="$pre,reverse"
  # 1) 4K -> 1080, (al contrario), velocità + interpolazione di movimento a 48 fps
  ffmpeg -y -v error -ss $a -t $(c "$sd+0.2") -i "$DIR/DN7A$clip.MP4" -an -vf "$pre,setpts=(PTS-STARTPTS)/$sp,$MI" -c:v libx264 -preset veryfast -crf 8 i_$n.mp4
  # 2) stabilizzazione
  ffmpeg -y -v error -i i_$n.mp4 -vf "vidstabdetect=shakiness=6:accuracy=15:result=$n.trf" -f null -
  # 3) grade, push-in in 4K riscalato, nitidezza, fade
  zoom="scale=w='trunc(3840*(1+0.06*t/$od)/2)*2':h=-2:eval=frame:flags=bicubic,crop=3840:2160,scale=1920:1080:flags=lanczos"
  ffmpeg -y -v error -i i_$n.mp4 -vf "vidstabtransform=input=$n.trf:smoothing=30:optzoom=1:interpol=bicubic,$LIFT,$MATTE,$zoom,$SHARP,vignette=PI/5,fade=t=in:st=0:d=$fi,fade=t=out:st=$(c "$od-$fo"):d=$fo" -frames:v $(printf %.0f $(c "$od*$FPS")) -r $FPS $ENC s_$n.mp4
  echo "file 's_$n.mp4'" >> list.txt
  [ -n "$nero" ] && { ffmpeg -y -v error -f lavfi -i color=black:s=1920x1080:r=$FPS -frames:v $nero $ENC black_$n.mp4; echo "file 'black_$n.mp4'" >> list.txt; }
done
ffmpeg -y -v error -f concat -safe 0 -i list.txt -c copy video.mp4
T=$(ffprobe -v error -show_entries format=duration -of csv=p=0 video.mp4)
# musica a 23 s: brano fino a 11.82 s, poi ripresa da 2.07 s alla fine (13.30 s); giunte su inizi di battuta
ffmpeg -y -v error -i video.mp4 -i "$M" -filter_complex "[1:a:0]asplit[m1][m2];[m1]atrim=0:11.82,asetpts=N/SR/TB[p1];[m2]atrim=2.07:13.30,asetpts=N/SR/TB[p2];[p1][p2]acrossfade=d=0.02:c1=tri:c2=tri,atrim=0:$T,afade=t=out:st=$(c "$T-1.0"):d=1.0[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart "$OUT"
echo "Fatto: $OUT ($T s)"
