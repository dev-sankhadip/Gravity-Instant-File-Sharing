var compileBtn=document.getElementById('compile');
var messageBox=document.getElementById("code-message");
compileBtn.addEventListener('click', function()
{
    
    var text=document.getElementById("compilerarea").value;
    var language=document.getElementById("language").value;
    if(language)
    {
        console.log(language);
        axios.post('http://23.96.37.148:3000/runcode',{text,language})
        .then((response)=>
        {
            messageBox.style.display="block";
            messageBox.value=response.data.message;
            console.log(response);
        })
        .catch((err)=>
        {
            console.log(err);
        })
    }
    else
    {
        alert("select one language");
    }
})
