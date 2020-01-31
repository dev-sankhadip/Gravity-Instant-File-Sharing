var bold=document.getElementById("bold");
bold.onclick=function()
{
	document.execCommand("bold");
}

document.getElementById("page").oninput=function(e)
{
	console.log(e.target.innerText);
}