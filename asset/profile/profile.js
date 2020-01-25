const image_update_btn=document.getElementById("image-update");
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
        convertToBase64(e.target.value)
        .then((res)=>
        {
            console.log(res);
        })
        .catch((err)=>
        {
            console.log(err);
        })
    }
})