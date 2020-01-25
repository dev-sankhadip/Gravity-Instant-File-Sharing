const image_update_btn=document.getElementById("image-update");
const profileImage=document.getElementById("profile-image");

image_update_btn.addEventListener("click", function(e)
{
    const fileInput=document.createElement("input");
    fileInput.type="file";
    fileInput.click();
    fileInput.onchange=function(e)
    {
        function convertToBase64(file)
        {
            return new Promise((resolve, reject)=>
            {
                const reader=new FileReader();
                reader.readAsDataURL(file);
                reader.onload=function()
                {
                    resolve(reader.result);
                }
                reader.onerror=function()
                {
                    reject(reader.result);
                }
            })
        }
        convertToBase64(e.target.files[0])
        .then((res)=>
        {
            profileImage.src=res;
            fetch('/users/update/image',{
                method:"POST",
                body:JSON.stringify({ res }),
                headers:{
                    Accept:"application/json",
                    'Content-Type':"application/json"
                }
            })
            .then((r)=>{ return r.json() })
            .then((r)=>{
                alert("Profile image updated");
            })
            .catch((err)=>{ console.log(err) })
        })
        .catch((err)=>
        {
            console.log(err);
        })
    }
})