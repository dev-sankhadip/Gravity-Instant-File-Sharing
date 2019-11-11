function emailShare(audioid)
{
    fetch(`/audio/generate/${audioid}`,{
        method:"GET"
    })
    .then((res)=>
    {
        return res.json();
    })
    .then((res)=>
    {
        document.querySelector("#link").value=res.link;
    })
    .catch((err)=>
    {
        console.log(err);
    })
}


var file_name_check=document.getElementById("file-name-input");
var upload_btn=document.getElementById("upload-btn");
var check_tag=document.getElementById("check-tag");
file_name_check.oninput=function(e)
{
    check_tag.innerHTML="<i class='fa fa-spinner fa-spin text-primary'></i>"
    const filename=e.target.value;
    fetch('/audio/check',{
        method:"POST",
        headers:{
            Accept:'aplication/json',
            'Content-Type':'application/json'
        },
        body:JSON.stringify({ filename })
    })
    .then((res)=>
    {
        return res.json();
    })
    .then((res)=>
    {
        console.log(res);
        if(res.code===12)
        {
            upload_btn.setAttribute("disabled", true);
            upload_btn.style.cursor="not-allowed";
            upload_btn.classList.remove("btn-success");
            upload_btn.classList.add("btn-danger");
            check_tag.innerHTML='<i class="fa fa-exclamation-triangle text-danger" aria-hidden="true"></i>'
        }
        else if(res.code==10)
        {
            upload_btn.removeAttribute("disabled");
            upload_btn.style.cursor="pointer";
            upload_btn.classList.remove("btn-danger");
            upload_btn.classList.add("btn-success");
            check_tag.innerHTML="<i class='fa fa-check text-success' aria-hidden='true'></i>"
        }
    })
    .catch((err)=>
    {
        console.log(err);
    })
}


var imageContent=document.getElementById("image-content");
var file=document.getElementById("customFile");
var fileNameDiv=document.getElementById("file-name-input-div");
var extension;
file.onchange=function(e)
{
    extension=e.target.value.split(".")[1];
    fileNameDiv.classList.remove("d-none");
}
$('#fileUploadForm').submit(function(e){
    e.preventDefault();
    console.log(extension);
    var file_name=document.getElementById("file-name-input").value;
    var uploadedSizeText=document.getElementById("uploadedSize");
    var totalSizeText=document.getElementById("totalSize");
    var fileUploadProgress=document.getElementById("file-upload-progress");
    $(this).ajaxSubmit({
        uploadProgress:function(event, position, total, complete)
        {
            fileUploadProgress.style.width=complete+"%";
            fileUploadProgress.innerHTML=complete+"%";
            uploadedSizeText.innerHTML=(position/1024/1024).toFixed(2)+"Mb";
            totalSizeText.innerHTML=(total/1024/1024).toFixed(2)+"Mb";
        },
        success: function(response){
            console.log(response);
            var tr_tag=document.createElement("tr");
            tr_tag.id=`${response.imageid}`;

            var td_name_tag=document.createElement("td");
            var td_name_text=document.createTextNode(file_name);
            td_name_text.className="song-name";
            td_name_tag.appendChild(td_name_text);

            var td_date_tag=document.createElement("td");
            var td_date_text=document.createTextNode(new Date().toLocaleDateString());
            td_date_tag.appendChild(td_date_text);

            var td_watch_tag=document.createElement("td");
            var i_watch_tag=document.createElement("i");
            i_watch_tag.className="fa fa-headphones";
            i_watch_tag.style.color="blue";
            i_watch_tag.id=`${file_name}.${extension}`;
            td_watch_tag.id=`${response.imageid}`
            i_watch_tag.addEventListener("click", function()
            {
                const parentElement=this.parentElement;
                const audioid=parentElement.id;
                playAudio(this.id, audioid);
            })
            td_watch_tag.appendChild(i_watch_tag);

            var td_download_tag=document.createElement("td");
            var a_download_tag=document.createElement("a");
            a_download_tag.href=`/audio/download/${response.imageid}`;
            var i_download_tag=document.createElement("i");
            i_download_tag.className="fa fa-cloud-download";
            i_download_tag.style.color="green";
            a_download_tag.appendChild(i_download_tag);
            td_download_tag.appendChild(a_download_tag);

            var td_delete_tag=document.createElement("td");
            var i_delete_tag=document.createElement("i");
            i_delete_tag.className="fa fa-trash";
            i_delete_tag.style.color="red";
            i_delete_tag.id=`${response.imageid}`;
            i_delete_tag.addEventListener("click", function()
            {
                const imageid=this.id;
                const parentTdDeleteElement=this.parentElement;
                const parentTrElement=parentTdDeleteElement.parentElement;
                parentTrElement.remove();
                fetch(`/audio/delete/${imageid}`,{
                    method:"DELETE"
                })
                .then((res)=>
                {
                    return res.json();
                })
                .then((res)=>
                {
                    console.log(res);
                })
                .catch((err)=>
                {
                    console.log(err);
                })
            })
            td_delete_tag.appendChild(i_delete_tag);

            td_share_tag=document.createElement("td");
            var div_tag_share=document.createElement("div");
            div_tag_share.classList.add("custom-control");
            div_tag_share.classList.add("custom-checkbox");
            var input_share_tag=document.createElement("input");
            input_share_tag.type="checkbox";
            input_share_tag.classList.add("custom-control-input");
            input_share_tag.classList.add("link-select");
            input_share_tag.id=`link-select${response.imageid}`;
            input_share_tag.value=`${response.imageid}`;
            var label_share_tag=document.createElement("label");
            label_share_tag.classList.add("custom-control-label");
            label_share_tag.setAttribute("for",`link-select${response.imageid}`);
            label_share_tag.innerHTML="select";

            div_tag_share.appendChild(input_share_tag);
            div_tag_share.appendChild(label_share_tag);

            td_share_tag.appendChild(div_tag_share);


            tr_tag.appendChild(td_name_tag);
            tr_tag.appendChild(td_date_tag);
            tr_tag.appendChild(td_watch_tag);
            tr_tag.appendChild(td_download_tag);
            tr_tag.appendChild(td_delete_tag);
            tr_tag.appendChild(td_share_tag);

            imageContent.appendChild(tr_tag);
        },
        error:function(error)
        {
            console.log(error);
        }
    });
    return false;
});

var audio_delete_button=document.getElementsByClassName("fa-trash");
for(let i=0;i<audio_delete_button.length;i++)
{
    audio_delete_button[i].addEventListener("click", function()
    {
        const imageid=this.id;
        const parentTdDeleteElement=this.parentElement;
        const parentTrElement=parentTdDeleteElement.parentElement;
        parentTrElement.remove();
        fetch(`/audio/delete/${imageid}`,{
            method:"DELETE"
        })
        .then((res)=>
        {
            return res.json();
        })
        .then((res)=>
        {
            console.log(res);
        })
        .catch((err)=>
        {
            console.log(err);
        })
    })
}


var audio_share_button=document.getElementsByClassName("fa-share-alt");
for(let i=0;i<audio_share_button.length;i++)
{
    audio_share_button[i].addEventListener("click", function()
    {
        const audioid=this.id;
        emailShare(audioid);
    })
}


function playAudio(audioname, audioid)
{
    document.querySelector("#hidden-btn").click();
    var audiosrc=document.getElementById("audio-source");
    audiosrc.src=`/${audioid}/audio/${audioname}`;
    document.getElementById("audio-player").load();
    document.getElementById("audio-player").play();
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
                    peaker.title=this.value*100+"%";
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
}


var audio_listen_btn=document.getElementsByClassName("fa-headphones");
for(let i=0;i<audio_listen_btn.length;i++)
{
    audio_listen_btn[i].addEventListener("click", function()
    {
        const parentElement=this.parentElement;
        const audioid=parentElement.id;
        playAudio(this.id, audioid);
    })
}
document.querySelector("#send-link-btn").addEventListener("click", function()
{
    var email=document.getElementsByClassName("share-email");
    var link=document.querySelector("#link").value;
    var arrOfEmail=[];
    var j=0;
    for(let i=0;i<email.length;i++)
    {
        arrOfEmail[j]=email[i].value;
        j++;
    }

        fetch('/share',{
            method:"POST",
            body:JSON.stringify({
                arrOfEmail,link
            }),
            headers:{
                Accept:"application/json",
                'Content-Type':"application/json"
            }
        })
        .then((res)=>
        {
            return res.json();
        })
        .then((res)=>
        {
            console.log(res);
        })
        .catch((err)=>
        {
            console.log(err);
        })
})

var add_reciepient=document.getElementById("add-reciepient");
add_reciepient.addEventListener("click", function()
{
    var main_input_div=document.createElement("div");
    main_input_div.classList.add("input-group");
    main_input_div.classList.add("flex-nowrap");

    var input_div=document.createElement("div");
    input_div.classList.add("input-group-prepend");
    var addon_text=document.createElement("span");
    addon_text.classList.add("input-group-text");
    addon_text.classList.add("bg-success");
    addon_text.classList.add("text-light");
    addon_text.id="addon-wrapping";
    addon_text.innerHTML="To:";
    input_div.appendChild(addon_text);

    var input_field=document.createElement("input");
    input_field.type="email";
    input_field.classList.add("form-control");
    input_field.classList.add("share-email");
    input_field.placeholder="Enter Email Here";

    main_input_div.appendChild(input_div);
    main_input_div.appendChild(input_field);

    document.getElementById("first-email-input-div").insertAdjacentElement("afterend",main_input_div);
})

$(document).ready(function()
{
    $(".nav-icon").click(function()
    {
        $("#mobile-menu").collapse('toggle');
        $("#mobile-menu").addClass("animated slideInRight faster")
    })
})


var search=document.getElementById("image-search");
var ul_tag=document.getElementById("ul");

search.addEventListener('input', function()
{
    searchImage(search.value);
})

const searchImage=async text=>
{
    fetch("/audio/getAllAudio",{
        method:"GET"
    })
    .then((res)=>
    {
        return res.json();
    })
    .then((response)=>
    {
        let matches=response.result.filter(state=>{
            const regex=new RegExp(`^${text}`,'gi');
            return state.name.match(regex);
        })
        if(text.length==0)
        {
            matches=[]
        }
        output(matches);
    })
}

const output=async matches=>{
    if(matches.length>0)
    {
        ul_tag.innerHTML="";
        matches.map((match)=>
        {
            var li_tag=document.createElement("li");
            var li_tag_text=document.createTextNode(match.name);
            li_tag.className="list-group-item";
            li_tag.id=match.audioid;
            li_tag.appendChild(li_tag_text);
            li_tag.addEventListener("click", function()
            {
                const id=this.id;
                document.getElementById("hidden-btn").click();
                playAudio(match.name, id);
            })
            ul_tag.appendChild(li_tag);
        })
    }
    else if(matches.length==0)
    {
        ul_tag.innerHTML="";
    }
}

document.getElementById("generate-multiple").addEventListener("click", function()
{
    var f=0;
    var linkGenerateIdArray=[];
    var linkSelect=document.getElementsByClassName("link-select");
    for(let i=0;i<linkSelect.length;i++)
    {
        if(linkSelect[i].checked===true)
        {
            f=1;
            linkGenerateIdArray.push(linkSelect[i].value);
        }
    }
    if(f==0)
    {
        alert("select at least one media");
    }
    else
    {
        fetch('/audio/generatemultiple',{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
                Accept:'application/json'
            },
            body:JSON.stringify({ linkGenerateIdArray })
        })
        .then((res)=>
        {
            return res.json();
        })
        .then((res)=>
        {
            document.getElementById("open-modal").click();
            document.querySelector("#link").value=res.link;
        })
        .catch((err)=>
        {
            console.log(err);
        })
    }
})