function randomNumber() {
    return Math.floor(Math.random() * 10000) + 1;
}

function postMessage(args) {
    window.parent.postMessage(args, "*");
}
self.fetch = (url, config) => {
    return new Promise((resolve, reject) => {
        const eventId = randomNumber();
        postMessage({
            command: "FETCH",
            eventId,
            url,
            config
        });
        onmessage = (e) => {
            if (e.data.eventId === eventId) {
            resolve(e.data.resp);
            }
        };
    });
};

class Context {
    static showAlert(message) {
        postMessage({
            key: "showAlert",
            command: "MESSAGE",
            data: message
        });
    }
    static showConfirm({ title, content, onOK, onCancel, okText, cancelText }) {
        const eventId = randomNumber();
        postMessage({
                data: {
                title,
                content,
                okText,
                cancelText
            },
            eventId,
            command: "CONFIRM"
        });
        onmessage = (e) => {
            if (e.data.eventId === eventId) {
                if (e.data.action === "OK") {
                    onOK();
                } else {
                    onCancel();
                }
            }
        };
    }
    static redirect(url, shouldConfirm) {
        const eventId = randomNumber();
        postMessage({
            data: {
                url
            },
            eventId,
            command: "REDIRECT"
        });
    }
}
  
class LCNCSdk {
    constructor(props) {
        console.log("Initializing LCNC SDK", props);
        this.context = Context;

        this._listeners = {};
        this._onMessage = this._onMessage.bind(this);

        window.addEventListener("message", this._onMessage, false);
    }

    api(url, args={}) {
        return this._fetch({ url, args });
    }

    watchParams(args={}) {
        return this._fetch(args, "PARAMS");
    }

    _addListener(_id, callback) {
        this._listeners[_id] = this._listeners[_id] || [];
        this._listeners[_id].push(callback);
    }

    _fetch(args, _id=randomNumber()) {
        return new Promise((resolve, reject) => {
            postMessage({_id, ...args});
            this._addListener(_id, (data) => {
              if (data.errorMessage) {
                reject(data);
              } else {
                resolve(data);
              }
            });
          });
      }

    _onMessage(event) {
        console.log("child receives messsage", event);
        const data = event.data;
        const _req = data._req || {}
        let listeners = this._listeners[_req._id] || [];

        if (listeners) {
            listeners.forEach(listener => {
                try {
                    listener(data);
                } catch (err) {
                    console.error("Message callback error: ", err);
                }
            });
        }
    }
    
}

function init(options = {}) {
    return new LCNCSdk(options);
}

export default init