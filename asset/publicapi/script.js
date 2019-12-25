var imageContent=document.getElementById("image-content");
var file=document.getElementById("customFile");
var fileNameDiv=document.getElementById("file-name-input-div");
file.onchange=function(e)
{
    fileNameDiv.classList.remove("d-none");
}
$('#fileUploadForm').submit(function(e){
    e.preventDefault();
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
            document.getElementById("link-box").classList.remove('d-none');
            document.getElementById("link").value=`http://127.0.0.1:4000/publicapi/download/${response.filesid}`;
            setTimeout(()=>
            {
                fileUploadProgress.style.width=0+"%";
                fileUploadProgress.innerHTML=0+"%";
                uploadedSizeText.innerHTML=0+"Mb";
                totalSizeText.innerHTML=0+"Mb";
            },2000);
            console.log(response);
        },
        error:function(error)
        {
            console.log(error);
        }
    });
    return false;
});

document.getElementById("copy-btn").addEventListener("mouseover", function()
{
    var copyText = document.getElementById("link");
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand("copy");
    alert('copied');
})