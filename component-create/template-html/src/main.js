import { kf } from "./sdk.js";

const divElement = document.getElementById("root");

const h1 = document.createElement("h1");

h1.innerText = `welcome ${kf.user.Name}`;

divElement.appendChild(h1);

