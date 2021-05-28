import businessUnits from './business-units.json'
import okrs from './okr.json'
import { API } from '../utils/constants'

const MockAPI = {}
MockAPI[API.BUSINESS_UNIT_LIST] = businessUnits
MockAPI[API.OKR_LIST] = okrs

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