#!/bin/bash
# Spot ORION verticale 9:16 (~20 s) con l'immagine in una fascia cinema 2.39:1 al centro e "ORION" sotto:
# le inquadrature restano larghe (ali e sidepod della S1000RR), le imperfezioni delle superfici non si leggono.
#   tools/orion_spot.sh CARTELLA_CLIP brano.(mp4|wav|mp3) orion_spot.mp4
# Clip 4K/50 fps di "S1000RR Andre video 29.10.2026". Look da spot premium (neri profondi, contrasto pulito,
# luce neutra-fredda, arancio e viola vivi, leggera diffusione), 48 fps interpolati, tagli sulle battute del brano
# (107.2 BPM, battuta 2.2388 s, downbeat 0.944, 3.183, 5.422, 7.660, 9.899, 12.138, 14.377, 16.616).
# Il brano finisce a ~17.4 s: dalla battuta delle 16.616 (inizio frase) riprende da quella delle 7.660
# (inizio della frase precedente) fino alla fine del video.
set -e
DIR="$(realpath "$1")"; M="$(realpath "$2")"; OUT="$(realpath -m "${3:-orion_spot.mp4}")"
WORK=$(mktemp -d); trap 'rm -rf "$WORK"' EXIT; cd "$WORK"
FPS=48; W=1080; H=1920; BW=1080; BH=452; BY=$(( (H-BH)/2 ))   # fascia 2.39:1 centrata
c() { awk "BEGIN{printf \"%.4f\", $1}"; }
fr() { printf %.0f $(c "$1*$FPS"); }
MI="minterpolate=fps=$FPS:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:me=epzs:vsbmc=1:scd=none:mb_size=16:search_param=96"
ENC="-c:v libx264 -preset slow -tune film -crf 14 -pix_fmt yuv420p"
# premium: neri a zero, contrasto a S, ombre leggermente fredde, saturazione contenuta (gli accenti tornano dopo)
GRADE="hqdn3d=3:3:4:4,curves=master='0/0 0.06/0.015 0.12/0.1 0.3/0.36 0.6/0.71 0.85/0.92 1/1',curves=r='0/0 0.5/0.49 1/1':b='0/0.02 0.5/0.51 1/0.98',eq=saturation=0.85"
SHARP="cas=strength=0.15"
# nome:clip:inizio:durata sorgente:velocità:durata output:fade in:fade out[:spostamento verticale del taglio 2.39 (px su 1080)]
SHOTS=${SHOTS:-"S1:9336:1.00:1.59:0.5:3.183:0.9:0.15:30
S2:9366:2.00:1.40:0.625:2.239:0.12:0.12:20
S3:9358:2.40:0.84:0.75:1.119:0.08:0.08
S4:9368:1.90:0.84:0.75:1.120:0.08:0.08:60
S5:9370:2.00:1.50:0.67:2.239:0.1:0.12
S6:9367:2.40:1.68:0.75:2.239:0.12:0.12:30
S7:9339:0.80:1.68:0.75:2.239:0.12:0.12
S8:9369:1.40:0.95:0.85:1.120:0.08:0.08:-60
S9:9347:1.25:0.95:0.85:1.119:0.08:0.08
S10:9326:1.60:1.30:0.775:1.680:0.1:0.5:60"}
CARD=${CARD:-1.564}          # chiusura: fascia nera, resta solo il nome
NAME=${NAME:-"O   R   I   O   N"}
: > list.txt; T0=0
for s in $SHOTS; do IFS=: read n clip a sd sp od fi fo dy <<< "$s"
  dy=${dy:-0}
  NF=$(( $(fr $(c "$T0+$od")) - $(fr $T0) )); T0=$(c "$T0+$od")
  echo "Inquadratura $n (DN7A$clip)…"
  # 1) 4K -> 1920x1080, velocità + interpolazione di movimento a 48 fps
  ffmpeg -y -v error -ss $a -t $(c "$sd+0.2") -i "$DIR/DN7A$clip.MP4" -an -vf "scale=1920:1080:flags=lanczos,setpts=(PTS-STARTPTS)/$sp,$MI" -c:v libx264 -preset veryfast -crf 8 i_$n.mp4
  # 2) stabilizzazione forte (tiene solo il movimento voluto)
  ffmpeg -y -v error -i i_$n.mp4 -vf "vidstabdetect=shakiness=8:accuracy=15:stepsize=4:result=$n.trf" -f null -
  # 3) grade, push-in lento calcolato in 4K (sub-pixel), taglio 2.39:1 -> fascia 1080x452, fade
  zoom="scale=w='trunc(3840*(1+0.04*t/$od)/2)*2':h=-2:eval=frame:flags=bicubic,crop=3840:2160,scale=1920:1080:flags=lanczos"
  ffmpeg -y -v error -i i_$n.mp4 -vf "vidstabtransform=input=$n.trf:smoothing=60:optzoom=1:interpol=bicubic,tpad=stop_mode=clone:stop_duration=0.5,$GRADE,$zoom,crop=1920:804:0:138+$dy,scale=$BW:$BH:flags=lanczos,$SHARP,fade=t=in:st=0:d=$fi,fade=t=out:st=$(c "$od-$fo"):d=$fo" -frames:v $NF -r $FPS $ENC s_$n.mp4
  echo "file 's_$n.mp4'" >> list.txt
done
NB=$(( $(fr $(c "$T0+$CARD")) - $(fr $T0) )); TC=$T0; T0=$(c "$T0+$CARD")
ffmpeg -y -v error -f lavfi -i color=black:s=${BW}x$BH:r=$FPS -frames:v $NB $ENC card.mp4; echo "file 'card.mp4'" >> list.txt
ffmpeg -y -v error -f concat -safe 0 -i list.txt -c copy band.mp4
T=$(ffprobe -v error -show_entries format=duration -of csv=p=0 band.mp4)

# finitura della fascia: diffusione morbida + alone caldo sulle luci, riflesso anamorfico, arancio/viola vivi,
# grana leggera, flash di esposizione sugli inizi di frase; poi tela verticale nera con ORION sotto la fascia,
# che alla chiusura (fascia nera) passa a piena luminosità
FLASH="0.8*max(0\,1-abs(T-7.69)/0.15)+0.5*max(0\,1-abs(T-16.65)/0.2)"
FONT=/usr/share/fonts/opentype/inter/InterDisplay-ExtraLight.otf
FC="[0:v]format=gbrp,huesaturation=saturation=0.45:colors=r+y,huesaturation=saturation=0.25:colors=m+b,split=4[b][d][h][s];
[d]gblur=sigma=8[dif];
[h]curves=all='0/0 0.55/0 1/1',gblur=sigma=14,colorchannelmixer=rr=1.0:gg=0.45:bb=0.25[hal];
[s]curves=all='0/0 0.7/0 1/1',scale=540:226,avgblur=sizeX=50:sizeY=1,avgblur=sizeX=25:sizeY=1,scale=$BW:$BH,colorchannelmixer=rr=0.25:gg=0.55:bb=1.0,lutrgb=r='val*2.2':g='val*2.2':b='val*2.2'[str];
[b][dif]blend=all_mode=lighten:all_opacity=0.22[x0];[x0][hal]blend=all_mode=screen:all_opacity=0.45[x1];
[x1][str]blend=all_expr='min(255\,(255-(255-A)*(255-B)/255)*(1+$FLASH))'[y];
[y]format=yuv444p,vignette=PI/6,noise=c0s=3:c0f=t+u,pad=$W:$H:0:$BY:black,
drawtext=fontfile=$FONT:text='$NAME':fontsize=64:fontcolor=white:x=(w-text_w)/2:y=$((BY+BH+150)):alpha='0.8*clip((t-0.6)/1.0\,0\,1)+0.2*clip((t-$TC)/0.6\,0\,1)',
format=yuv420p[v]"
ffmpeg -y -v error -i band.mp4 -filter_complex "$FC" -map "[v]" -c:v libx264 -preset slow -tune film -crf 15 graded.mp4
# brano: fino al downbeat delle 16.616 s, poi dal downbeat delle 7.660 s; giunta con dissolvenza di 30 ms centrata
ffmpeg -y -v error -i graded.mp4 -i "$M" -filter_complex "[1:a:0]asplit[m1][m2];[m1]atrim=0:16.631,asetpts=N/SR/TB[p1];[m2]atrim=7.645,asetpts=N/SR/TB[p2];[p1][p2]acrossfade=d=0.03:c1=qsin:c2=qsin,atrim=0:$T,afade=t=out:st=$(c "$T-1.4"):d=1.4[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart "$OUT"
echo "Fatto: $OUT ($T s)"
