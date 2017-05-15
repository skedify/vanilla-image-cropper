const CustomEvent = typeof window.CustomEvent === "function"
    ? window.CustomEvent
    : Object.defineProperties(function CustomEvent (event, params) {
        params = params || { bubbles : false, cancelable : false, detail : undefined };
        const evt = document.createEvent('CustomEvent');

        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }, {
        prototype : {
            value : window.Event.prototype,
            writable : false,
            configurable : false,
        },
    });

export default CustomEvent;
