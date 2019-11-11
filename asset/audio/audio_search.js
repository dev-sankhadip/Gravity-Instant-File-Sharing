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
                // document.getElementById("hidden-btn").click();
                var audiosrc=document.getElementById("audio-source");
                audiosrc.src=`/${id}/audio/${match.name}`;
                document.getElementById("audio-player").load();
                document.getElementById("audio-player").play();
            })
            ul_tag.appendChild(li_tag);
        })
    }
    else if(matches.length==0)
    {
        ul_tag.innerHTML="";
    }
}