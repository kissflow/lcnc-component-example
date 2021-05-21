import './index.css'
import  Card from "./component";

window.addEventListener('load', () => {
    const comp = new Card(document.getElementById('component'))

    // A very simple component setup
    comp.render()

    // Render the time every 1s
    setInterval(() => {
        comp.render()
    }, 1000)

})