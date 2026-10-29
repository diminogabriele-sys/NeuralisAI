#!/bin/bash
# Edit BMW (prova.mov): stile matte desaturato con push-in lento, tagli sulle battute della musica (123 BPM),
# transizioni al nero, stabilizzazione vidstab per inquadratura.
#   tools/bmw_edit.sh prova.mov musica.(wav|mp3|mp4) edit_bmw.mp4
# I tempi delle inquadrature (SHOTS) sono tarati su prova.mov e sulla musica del video di riferimento.
set -e
F="$(realpath "$1")"; M="$(realpath "$2")"; OUT="$(realpath -m "${3:-edit_bmw.mp4}")"
WORK=$(mktemp -d); trap 'rm -rf "$WORK"' EXIT; cd "$WORK"
# look: neri profondi, alte smorzate, saturazione ridotta, tinta fredda
MATTE="curves=r='0/0.03 0.25/0.28 0.5/0.55 0.75/0.8 1/0.95':g='0/0.035 0.25/0.29 0.5/0.57 0.75/0.81 1/0.96':b='0/0.04 0.25/0.3 0.5/0.57 0.75/0.79 1/0.95',eq=saturation=0.65:contrast=1.1"
LIFT_D="hqdn3d=4:3:8:6,curves=master='0/0 0.065/0.03 0.11/0.19 0.25/0.53 0.5/0.78 0.8/0.93 1/1'"
LIFT_A="hqdn3d=2:2:4:4,curves=master='0/0 0.1/0.06 0.3/0.33 0.6/0.68 1/1'"
# nome:inizio:durata sorgente:velocità:durata output:fade in:fade out
SHOTS="A:0.40:1.66:0.8:2.07:0.5:0.15 B:3.45:1.17:0.6:1.95:0.15:0.15 C:5.65:1.56:0.8:1.95:0.15:0.15 D:7.67:1.22:0.72:1.70:0.08:0.4 E:11.85:1.56:0.8:1.95:0.3:0.15 F:15.55:1.37:0.4:3.43:0.2:1.2"
: > list.txt
for s in $SHOTS; do IFS=: read n a sd sp od fi fo <<< "$s"
  # A: stabilizzazione leggera e poco crop; D (panoramica voluta verso la gomma, scritta Akrapovič sul bordo alto): niente stabilizzazione
  lift=$LIFT_D; stab="smoothing=40:optzoom=1"; push=0.07
  [ $n = A ] && lift=$LIFT_A
  [ $n = A ] && { stab="smoothing=10:optzoom=0:zoom=3"; push=0.03; }
  [ $n = D ] && { stab=""; push=0.02; }
  # rallenty: interpolazione di movimento (fluida), prima della stabilizzazione
  slow="setpts=(PTS-STARTPTS)/$sp"
  [ "$(echo "$sp < 1"|bc)" = 1 ] && slow="$slow,minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:me=epzs:vsbmc=1:scd=none:mb_size=16:search_param=32"
  ffmpeg -y -v error -ss $a -t $sd -i "$F" -an -vf "$slow,vidstabdetect=shakiness=8:accuracy=15:stepsize=4:result=$n.trf" -f null -
  zoom="scale=w='trunc(1920*(1+$push*t/$od)/2)*2':h=-2:eval=frame,crop=1920:1080"
  ffmpeg -y -v error -ss $a -t $sd -i "$F" -an -vf "$slow,${stab:+vidstabtransform=input=$n.trf:$stab:interpol=bicubic,}fps=24,$lift,$MATTE,$zoom,unsharp=5:5:0.5,vignette=PI/5,fade=t=in:st=0:d=$fi,fade=t=out:st=$(echo "$od-$fo"|bc):d=$fo,format=yuv420p" -frames:v $(printf %.0f $(echo "$od*24"|bc)) -r 24 -c:v libx264 -preset slow -crf 16 s_$n.mp4
  echo "file 's_$n.mp4'" >> list.txt
  # pausa della musica (7.0-7.9 s): resta sul nero fino al colpo delle 7.92
  [ $n = D ] && { ffmpeg -y -v error -f lavfi -i color=black:s=1920x1080:r=24 -frames:v 6 -c:v libx264 -crf 16 -pix_fmt yuv420p black.mp4; echo "file 'black.mp4'" >> list.txt; }
done
ffmpeg -y -v error -f concat -safe 0 -i list.txt -c copy video.mp4
T=$(ffprobe -v error -show_entries format=duration -of csv=p=0 video.mp4)
ffmpeg -y -v error -i video.mp4 -i "$M" -map 0:v -map 1:a:0 -c:v copy -af "atrim=0:$T,afade=t=out:st=$(echo "$T-0.8"|bc):d=0.8" -c:a aac -b:a 256k -shortest -movflags +faststart "$OUT"
echo "Fatto: $OUT ($T s)"
