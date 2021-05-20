import './index.css'
import  Component from "./component";

window.addEventListener('load', () => {
    const comp = new Component(document.getElementById('component'))

    // A very simple component setup
    comp.render()

    // Render the time every 1s
    // setInterval(() => {
    //     comp.render()
    // }, 1000)

})