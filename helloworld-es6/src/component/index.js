import KFLowcodeSDK from "@kissflow/lowcode-client-sdk";
const kf = KFLowcodeSDK();

export default class Card {
    constructor (elem) {
      if (!elem) return
      this.elem = elem
      this.kf = kf;
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
      this.kf.api("/id").then((res) => {
         console.info("API response is", res);
         document.getElementById("username").innerText = res.UserDetails.Name;
      });
    }

    watchParams () {
      this.kf.watchParams(function(data) {
        console.info("inside component watch param", data);
      });
    }
}