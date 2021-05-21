const lcnc = new LCNC();

function getProfileInfo() {
    lcnc.api("/id").then((res) => {
        console.info("API response is", res);
        document.getElementById("output").innerText = res.UserDetails.Name;
     });
}

