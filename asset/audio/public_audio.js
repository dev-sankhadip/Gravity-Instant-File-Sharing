var play_icon=document.getElementById("play");
play_icon.addEventListener("click", function()
{
        var audio=document.getElementById("audio-player");
        if(play_icon.classList.contains("fa-play"))
        {
            play.classList.remove("fa-play");
            play.classList.add("fa-pause");
            play.title="Pause";
            audio.play();
        }
        else if(play_icon.classList.contains("fa-pause"))
        {
            play.classList.remove("fa-pause");
            play.classList.add("fa-play");
            play.title="Play";
            audio.pause();
        }
})

var audio=document.getElementById("audio-player");
audio.ontimeupdate=function()
{
    var progress=document.getElementById("progress");
    var time=(100 / this.duration)*this.currentTime;
    progress.style.width=time+"%";
    if(audio.currentTime==audio.duration)
    {
        play_icon.className="fa fa-play";
        play_icon.title="Play";
    }
    else
    {
        play_icon.className="fa fa-pause";
        play_icon.title="Pause";
    }
}

var replay_icon=document.getElementById("replay");
replay_icon.onclick=function()
{
    audio.currentTime=0;
    audio.play();
    play_icon.className="fa fa-pause";
    this.title="Pause";
}
        
var progress_bar=document.getElementById("progress-bar");
progress_bar.onclick=function(event)
{
    var percent=event.offsetX / this.offsetWidth;
    audio.currentTime=percent*audio.duration;
}

audio.onprogress=function()
{
    var percentage=(audio.buffered.end(0) / audio.duration)*100;
    var buffer_progress=document.getElementById("buffer-progress");
    buffer_progress.style.width=percentage+"%";
}

var speaker=document.getElementById("volume");
speaker.onclick=function()
{
    var volume_slider=document.getElementById("volume-slider");
    if(volume_slider.style.display=="none")
    {
        volume_slider.style.display="block";
        volume_slider.oninput=function()
        {
            audio.volume=this.value;
            if(this.value<=0)
            {
                speaker.className="fa fa-volume-off";
                speaker.title=this.value*100+"%";
            }
            else if(this.value<=0.5)
            {
                speaker.className="fa fa-volume-down";
                speaker.title=this.value*100+"%";
            }
            else
            {
                speaker.className="fa fa-volume-up";
                speaker.title=this.value*100+"%";
            }
        }
    }
    else
    {
            volume_slider.style.display="none";
    }
}