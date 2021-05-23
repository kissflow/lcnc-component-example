import businessUnits from './business.units.json'

const MockAPI = {
  "/dataset/2/AcTGcH31RtTqP/Business_Units/list": businessUnits,
}

class LcncSdk {
    constructor(props) {
        console.log("Initializing LCNC SDK", props);
        this._listeners = {};
    }

    api(url, args={}) {
        return this._fetch("API", { url, args });
    }

    watchParams(args={}) {
        return this._fetch("PARAMS", args);
    }

    _fetch(command, args) {
        let json = MockAPI[args.url] || {"Id": "url doesn't match"}
        //const resp = new Response(JSON.stringify(json), { "status" : 200 })
        return new Promise((resolve, reject) => {
            resolve(json);
        });
      }
}

class ProcessSdk extends LcncSdk {
    
}

function initSDK(config = {}) {
    if (config.flow === "Process") {
        return new ProcessSdk(config);
    }
    return new LcncSdk(config);
}

export default initSDK