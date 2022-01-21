const kf = window.KF();
console.info("*******", kf);

function getProfileInfo() {
    kf.api("/id").then((res) => {
        console.info("API response is", res);
        document.getElementById("output").innerText = res.UserDetails.Name;
     });
}

