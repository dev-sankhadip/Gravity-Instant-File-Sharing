var search=document.getElementById("image-search");
var ul_tag=document.getElementById("ul");

search.addEventListener('input', function()
{
    searchImage(search.value);
})

const searchImage=async text=>
{
    fetch("/image/getAllImage",{
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
            li_tag.id=match.imageid;
            li_tag.appendChild(li_tag_text);
            li_tag.addEventListener("click", function()
            {
                const id=this.id;
                document.getElementById("btn").click();
                document.getElementById("select-image").src=`/${id}/image/${match.name}`
            })
            ul_tag.appendChild(li_tag);
        })
    }
    else if(matches.length==0)
    {
        ul_tag.innerHTML="";
    }
}