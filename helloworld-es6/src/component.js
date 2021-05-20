//import LCNC from '@kissflow/lcnc-sdk-js';
import LCNC from './lcnc-sdk';

export default class Component {
    constructor (elem) {
      if (!elem) return
      this.elem = elem
      this.lcnc = LCNC();
    }

    render () {
        if (this.elem) this.elem.innerHTML = `
        <section data-component="custom">
        <h1>Custom Component</h1>  
        <p>The time is: ${(new Date()).toLocaleString()}</p>
        <button id="callParent">Call Parent</button>
        <button id="watchParams">Watch for Params</button>
        </section>
        `
      this.bindEvents();
    }

    bindEvents () {
      document.getElementById("callParent").onclick = this.callParent.bind(this);
      document.getElementById("watchParams").onclick = this.watchParams.bind(this);
    }

    callParent () {
      this.lcnc.api("/id").then((res) => {
         console.info("API response is", res);
      });
    }

    watchParams () {
      this.lcnc.watchParams({"test": 123}).then((res) => {
        console.info("inside component watch param", res);
      });
    }
}