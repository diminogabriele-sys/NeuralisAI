#!/bin/bash
# Spot ORION verticale 9:16 (~20 s): ali e sidepod della S1000RR, riprese il più larghe possibile.
#   tools/orion_spot.sh CARTELLA_CLIP brano.(mp4|wav|mp3) orion_spot.mp4
# Clip 4K/50 fps di "S1000RR Andre video 29.10.2026". Look da spot premium (neri profondi, contrasto pulito,
# luce neutra-fredda, arancio e viola vivi, leggera diffusione che ammorbidisce le superfici), 48 fps interpolati,
# tagli sulle battute del brano (107.2 BPM, battuta 2.2388 s, downbeat 0.944, 3.183, 5.422, 7.660, 9.899,
# 12.138, 14.377, 16.616). Il brano finisce a ~17.4 s: dalla battuta delle 16.616 (inizio frase) si riprende
# dalla battuta delle 7.660 (inizio della frase precedente) fino alla fine del video.
set -e
DIR="$(realpath "$1")"; M="$(realpath "$2")"; OUT="$(realpath -m "${3:-orion_spot.mp4}")"
WORK=$(mktemp -d); trap 'rm -rf "$WORK"' EXIT; cd "$WORK"
FPS=48; W=1080; H=1920
c() { awk "BEGIN{printf \"%.4f\", $1}"; }
fr() { printf %.0f $(c "$1*$FPS"); }
MI="minterpolate=fps=$FPS:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:me=epzs:vsbmc=1:scd=none:mb_size=16:search_param=96"
ENC="-c:v libx264 -preset slow -tune film -crf 14 -pix_fmt yuv420p"
# premium: neri a zero, contrasto a S, ombre leggermente fredde, saturazione contenuta (gli accenti tornano dopo)
GRADE="hqdn3d=3:3:4:4,curves=master='0/0 0.06/0.015 0.12/0.1 0.3/0.36 0.6/0.71 0.85/0.92 1/1',curves=r='0/0 0.5/0.49 1/1':b='0/0.02 0.5/0.51 1/0.98',eq=saturation=0.85"
SHARP="cas=strength=0.15"
# nome:clip:inizio:durata sorgente:velocità:durata output:fade in:fade out:centro x da/a (frazione larghezza 4K)
SHOTS=${SHOTS:-"S1:9336:1.00:1.59:0.5:3.183:0.9:0.15:0.48/0.48
S2:9366:2.00:1.40:0.625:2.239:0.12:0.12:0.48/0.50
S3:9358:2.40:0.84:0.75:1.119:0.08:0.08:0.33/0.33
S4:9368:1.90:0.84:0.75:1.120:0.08:0.08:0.45/0.45
S5:9370:2.00:1.50:0.67:2.239:0.1:0.12:0.42/0.42
S6:9367:2.40:1.68:0.75:2.239:0.12:0.12:0.50/0.50
S7:9339:0.80:1.68:0.75:2.239:0.12:0.12:0.45/0.45
S8:9369:1.40:0.95:0.85:1.120:0.08:0.08:0.45/0.45
S9:9347:1.25:0.95:0.85:1.119:0.08:0.08:0.55/0.55
S10:9326:1.60:1.30:0.775:1.680:0.1:0.5:0.40/0.45"}
CARD=${CARD:-1.564}          # cartello finale nero con il nome
NAME=${NAME:-"O   R   I   O   N"}
: > list.txt; T0=0
for s in $SHOTS; do IFS=: read n clip a sd sp od fi fo cx <<< "$s"
  x0=${cx%/*}; x1=${cx#*/}
  NF=$(( $(fr $(c "$T0+$od")) - $(fr $T0) )); T0=$(c "$T0+$od")
  echo "Inquadratura $n (DN7A$clip)…"
  # 1) striscia dal 4K più larga del 9:16 (1620x2160 -> 1440x1920: 180 px di margine per lato) che segue il
  #    soggetto; velocità + interpolazione a 48 fps
  crop="crop=1620:2160:x='clip(3840*($x0+($x1-$x0)*t/$sd)-810\,0\,2220)':y=0,scale=1440:$H:flags=lanczos"
  ffmpeg -y -v error -ss $a -t $(c "$sd+0.2") -i "$DIR/DN7A$clip.MP4" -an -vf "$crop,setpts=(PTS-STARTPTS)/$sp,$MI" -c:v libx264 -preset veryfast -crf 8 i_$n.mp4
  # 2) stabilizzazione sulla striscia larga: i bordi della compensazione restano fuori dal taglio 9:16,
  #    quindi niente zoom automatico (solo 5% fisso per il margine in alto e in basso)
  ffmpeg -y -v error -i i_$n.mp4 -vf "vidstabdetect=shakiness=8:accuracy=15:stepsize=4:result=$n.trf" -f null -
  # 3) taglio 9:16 centrale, grade, push-in lento (3%) calcolato al doppio della risoluzione, fade
  zoom="scale=w='trunc(2160*(1+0.03*t/$od)/2)*2':h=-2:eval=frame:flags=bicubic,crop=2160:3840,scale=$W:$H:flags=lanczos"
  ffmpeg -y -v error -i i_$n.mp4 -vf "vidstabtransform=input=$n.trf:smoothing=40:optzoom=0:zoom=5:interpol=bicubic,crop=$W:$H,tpad=stop_mode=clone:stop_duration=0.5,$GRADE,$zoom,$SHARP,fade=t=in:st=0:d=$fi,fade=t=out:st=$(c "$od-$fo"):d=$fo" -frames:v $NF -r $FPS $ENC s_$n.mp4
  echo "file 's_$n.mp4'" >> list.txt
done
NB=$(( $(fr $(c "$T0+$CARD")) - $(fr $T0) )); TC=$T0; T0=$(c "$T0+$CARD")
ffmpeg -y -v error -f lavfi -i color=black:s=${W}x$H:r=$FPS -frames:v $NB $ENC card.mp4; echo "file 'card.mp4'" >> list.txt
ffmpeg -y -v error -f concat -safe 0 -i list.txt -c copy video.mp4
T=$(ffprobe -v error -show_entries format=duration -of csv=p=0 video.mp4)

# finitura: diffusione morbida + alone caldo sulle luci, riflesso anamorfico, arancio/viola vivi, grana leggera,
# flash di esposizione sugli inizi di frase, nome sul cartello finale
FLASH="0.8*max(0\,1-abs(T-7.69)/0.15)+0.5*max(0\,1-abs(T-16.65)/0.2)"
FONT=/usr/share/fonts/opentype/inter/InterDisplay-ExtraLight.otf
FC="[0:v]format=gbrp,huesaturation=saturation=0.45:colors=r+y,huesaturation=saturation=0.25:colors=m+b,split=4[b][d][h][s];
[d]gblur=sigma=14[dif];
[h]curves=all='0/0 0.55/0 1/1',gblur=sigma=26,colorchannelmixer=rr=1.0:gg=0.45:bb=0.25[hal];
[s]curves=all='0/0 0.7/0 1/1',scale=540:960,avgblur=sizeX=70:sizeY=1,avgblur=sizeX=35:sizeY=1,scale=$W:$H,colorchannelmixer=rr=0.25:gg=0.55:bb=1.0,lutrgb=r='val*2.2':g='val*2.2':b='val*2.2'[str];
[b][dif]blend=all_mode=lighten:all_opacity=0.22[x0];[x0][hal]blend=all_mode=screen:all_opacity=0.45[x1];
[x1][str]blend=all_expr='min(255\,(255-(255-A)*(255-B)/255)*(1+$FLASH))'[y];
[y]format=yuv444p,vignette=PI/6,noise=c0s=3:c0f=t+u,
drawtext=fontfile=$FONT:text='$NAME':fontsize=110:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2:alpha='clip((t-$TC-0.15)/0.5\,0\,1)',
format=yuv420p[v]"
ffmpeg -y -v error -i video.mp4 -filter_complex "$FC" -map "[v]" -c:v libx264 -preset slow -tune film -crf 15 graded.mp4
# brano: fino al downbeat delle 16.616 s, poi dal downbeat delle 7.660 s; giunta con dissolvenza di 30 ms centrata
ffmpeg -y -v error -i graded.mp4 -i "$M" -filter_complex "[1:a:0]asplit[m1][m2];[m1]atrim=0:16.631,asetpts=N/SR/TB[p1];[m2]atrim=7.645,asetpts=N/SR/TB[p2];[p1][p2]acrossfade=d=0.03:c1=qsin:c2=qsin,atrim=0:$T,afade=t=out:st=$(c "$T-1.4"):d=1.4[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart "$OUT"
echo "Fatto: $OUT ($T s)"
