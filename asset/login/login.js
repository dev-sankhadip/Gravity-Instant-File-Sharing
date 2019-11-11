var profile_pic_upload=document.getElementById("customFile");
profile_pic_upload.onchange=function(e)
{
    const filepath=e.target.value;
    document.getElementById("profile-pic-name").innerHTML=e.target.value.substr(12,filepath.length-1);
}



// var login=document.getElementById("login-form");
// login.onsubmit=(e)=>
// {
//     e.preventDefault();
//     const email=document.getElementById("login-email").value;
//     const password=document.getElementById("login-password").value;
//     axios.post('/login',{email, password})
//     .then((response)=>
//     {
//         if(response.data.code==400)
//         {
//             const emailAlertDiv=document.getElementById("login-email-alert-div");
//             emailAlertDiv.classList.remove("d-none");
//             const loginEmailAlert=document.getElementById("login-email-alert");
//             loginEmailAlert.innerHTML="Email does not exist";
//             setTimeout(()=>
//             {
//                 emailAlertDiv.classList.add("d-none");
//             },2000)
//         }
//         else if(response.data.code==300)
//         {
//             const passwordAlertDiv=document.getElementById("login-password-alert-div");
//             passwordAlertDiv.classList.remove("d-none");
//             const loginPasswordAlert=document.getElementById("login-password-alert");
//             loginPasswordAlert.innerHTML="Email and password does not match";
//             setTimeout(()=>
//             {
//                 passwordAlertDiv.classList.add("d-none");
//             },2000)
//         }
//         else
//         {
//             console.log(response);
//             localStorage.setItem("token",response.data.token);4
//             console.log(response.data.token);
//             window.location.replace('http://127.0.0.1:4000/check');
//         }
//     })
// }



// var signup=document.getElementById("signup-form");
// signup.onsubmit=(e)=>
// {
//     e.preventDefault();
//     const username=document.getElementById("signup-username").value;
//     const email=document.getElementById("signup-email").value;
//     const mobile=document.getElementById("signup-mobile").value;
//     const password=document.getElementById("signup-password").value;
//     // console.log(username+" "+email+" "+mobile+" "+password);
//     axios.post('/signup',{username,email,mobile, password})
//     .then((response)=>
//     {
//         console.log(response);
//         if(response.data.status==400)
//         {
//             const emailAlertDiv=document.getElementById("signup-password-alert-div");
//             emailAlertDiv.classList.remove("d-none");
//             const signPasswordAlert=document.getElementById("signup-password-alert");
//             signPasswordAlert.innerHTML="Password should be of 6 character";
//         }
//         else if(response.data.status==300)
//         {
//             const emailAlertDiv=document.getElementById("signup-email-alert-div");
//             emailAlertDiv.classList.remove("d-none");
//             const signupEmailAlert=document.getElementById("signup-email-alert");
//             signupEmailAlert.innerHTML="Email already registered";
//         }
//         else if(response.data.code==200)
//         {
//             console.log("...");
//             const signupSuccessDiv=document.getElementById("signup-success-div");
//             signupSuccessDiv.classList.remove("d-none");
//             const signupSuccessAlert=document.getElementById("signup-success-alert");
//             signupSuccessAlert.innerHTML="You are registered";
//             setTimeout(()=>
//             {
//                 signupSuccessDiv.classList.add("d-none");
//             },3000);
//             setTimeout(()=>
//             {
//                 document.getElementById("login-tab").click();
//             },4000)
//         }
//     })
// }