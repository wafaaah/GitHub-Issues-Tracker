const signin_btn = document.getElementById("signin_btn");

signin_btn.addEventListener("click", (e) => {

    const userValue = document.getElementById("user").value;
    const passValue = document.getElementById("password").value;

    if(!userValue || !passValue){
        alert("Please provide username and password");
    } else if(userValue === "admin" && passValue === "admin123"){
        window.location.href = "./Home.html";
    }else {
        alert("Invalid username and password ");
    }
});