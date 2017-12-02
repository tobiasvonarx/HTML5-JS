var mp3snd 	= "sound/audio-file.mp3";
var oggsnd 	= "sound/audio-file.ogg";

var loopsong = 'yes'			//LOOP MUSIC  yes  no 
var autostarts	= 'yes'			//AUTO START MUSIC  yes  no 

var audiowidth	= "300"			//WIDTH OF PLAYER
var borderw	= "0"			 	//BORDER WIDTH AROUND PLAYER
var bordcolor	= "0066FF"		//BORDER COLOR
var centerp	= "no"			 	//CENTER PLAYER  yes  no 

if (loopsong == "yes") {
	var looping5="loop";
	var loopingE="true";
}
else{
	var looping5="";
	var loopingE="false";
}
	if (autostarts == "yes") {
	var h5auto="autoplay";
	var h4auto="1";
}
else{
	var h5auto="";
	var h4auto="0";
}
	if (centerp == "yes") {
	var centerply="auto";
}
else{
	var centerply="0";
}
	if (centerp == "yes") {
	document.write('<center>');
}

document.write('<table style="border-collapse:collapse; border-spacing: 0px; margin: '+centerply+'; padding: 0px; border: #'+bordcolor+' '+borderw+'px solid;"><tr><td style="vertical-align: middle; text-align: center; padding: 0px;">');
document.write('<audio '+h5auto+' controls '+looping5+' style="width:'+audiowidth+'px;">');
document.write('<source src="'+mp3snd+'" type="audio/mpeg">');
document.write('<source src="'+oggsnd+'" type="audio/ogg">');
document.write('<object classid="CLSID:22D6F312-B0F6-11D0-94AB-0080C74C7E95" type="application/x-mplayer2" width="'+audiowidth+'" height="45">');
document.write('<param name="filename" value="'+mp3snd+'">');
document.write('<param name="autostart" value="'+h4auto+'">');
document.write('<param name="loop" value="'+loopingE+'">');
document.write('</object>');
document.write('</audio>');
document.write('</td></tr></table>');

if (centerp == "yes") {
	document.write('</center>');
}