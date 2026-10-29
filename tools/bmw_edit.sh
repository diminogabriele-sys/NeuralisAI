#!/bin/bash
# Edit BMW (prova.mov): stile matte desaturato con push-in lento, tagli sulle battute della musica (123 BPM),
# transizioni al nero, stabilizzazione vidstab per inquadratura.
#   tools/bmw_edit.sh prova.mov musica.(wav|mp3|mp4) edit_bmw.mp4
# I tempi delle inquadrature (SHOTS) sono tarati su prova.mov e sulla musica del video di riferimento.
# Fluidità: ogni inquadratura è interpolata col movimento a 48 fps (anche i rallenty), il push-in è calcolato
# in 4K e riscalato (niente scatti di un pixel). Nitidezza: denoise leggero, poi CAS + unsharp sulla luma.
set -e
F="$(realpath "$1")"; M="$(realpath "$2")"; OUT="$(realpath -m "${3:-edit_bmw.mp4}")"
WORK=$(mktemp -d); trap 'rm -rf "$WORK"' EXIT; cd "$WORK"
FPS=48
MI="minterpolate=fps=$FPS:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:me=epzs:vsbmc=1:scd=none:mb_size=16:search_param=32"
ENC="-c:v libx264 -preset slow -tune film -crf 14 -pix_fmt yuv420p"
# matte: neri sollevati e grigi, alte smorzate, poca saturazione, tinta fredda verde-grigia
MATTE="curves=r='0/0.07 0.5/0.47 1/0.9':g='0/0.08 0.5/0.49 1/0.91':b='0/0.085 0.5/0.49 1/0.9',eq=saturation=0.5:contrast=1.05"
LIFT_D="hqdn3d=4:3:8:6,curves=master='0/0 0.065/0.03 0.11/0.17 0.25/0.50 0.5/0.76 0.8/0.93 1/1'"
LIFT_A="hqdn3d=2:2:4:4,curves=master='0/0 0.1/0.06 0.3/0.33 0.6/0.68 1/1'"
SHARP="cas=strength=0.7,unsharp=5:5:0.9:5:5:0"
# nome:inizio:durata sorgente:velocità:durata output:fade in:fade out
SHOTS=${SHOTS:-"A:0.20:2.10:1:2.07:0.5:0.15 B:3.45:1.17:0.6:1.95:0.15:0.15 C:5.50:1.95:1:1.95:0.15:0.15 D:7.75:2.20:1.3:1.70:0.15:0.4 E:11.75:1.95:1:1.95:0.3:0.15 F:15.55:1.37:0.4:3.43:0.2:1.2"}
: > list.txt
for s in $SHOTS; do IFS=: read n a sd sp od fi fo <<< "$s"
  lift=$LIFT_D; [ $n = A ] && lift=$LIFT_A
  echo "Inquadratura $n…"
  # 1) velocità + interpolazione di movimento a 48 fps (un solo passaggio, file intermedio quasi senza perdite);
  #    0.2 s di sorgente in più così ogni inquadratura ha tutti i fotogrammi e i tagli restano sulle battute
  ffmpeg -y -v error -ss $a -t $(echo "$sd+0.2"|bc) -i "$F" -an -vf "setpts=(PTS-STARTPTS)/$sp,$MI" -c:v libx264 -preset veryfast -crf 8 i_$n.mp4
  # 2) stabilizzazione sull'interpolato
  ffmpeg -y -v error -i i_$n.mp4 -vf "vidstabdetect=shakiness=6:accuracy=15:result=$n.trf" -f null -
  # 3) grade, push-in in 4K riscalato (movimento sub-pixel), nitidezza, fade
  zoom="scale=w='trunc(3840*(1+0.07*t/$od)/2)*2':h=-2:eval=frame:flags=bicubic,crop=3840:2160,scale=1920:1080:flags=lanczos"
  ffmpeg -y -v error -i i_$n.mp4 -vf "vidstabtransform=input=$n.trf:smoothing=36:optzoom=1:interpol=bicubic,$lift,$MATTE,$zoom,$SHARP,vignette=PI/5,fade=t=in:st=0:d=$fi,fade=t=out:st=$(echo "$od-$fo"|bc):d=$fo" -frames:v $(printf %.0f $(echo "$od*$FPS"|bc)) -r $FPS $ENC s_$n.mp4
  echo "file 's_$n.mp4'" >> list.txt
  # pausa della musica (7.0-7.9 s): resta sul nero fino al colpo delle 7.92
  [ $n = D ] && { ffmpeg -y -v error -f lavfi -i color=black:s=1920x1080:r=$FPS -frames:v 12 $ENC black.mp4; echo "file 'black.mp4'" >> list.txt; }
done
ffmpeg -y -v error -f concat -safe 0 -i list.txt -c copy video.mp4
T=$(ffprobe -v error -show_entries format=duration -of csv=p=0 video.mp4)
ffmpeg -y -v error -i video.mp4 -i "$M" -map 0:v -map 1:a:0 -c:v copy -af "atrim=0:$T,afade=t=out:st=$(echo "$T-0.8"|bc):d=0.8" -c:a aac -b:a 256k -shortest -movflags +faststart "$OUT"
echo "Fatto: $OUT ($T s)"
