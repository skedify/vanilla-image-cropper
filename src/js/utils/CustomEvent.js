export function checkCustomEventConstructor () {
    if (typeof window.CustomEvent !== "function") {
        // The CustomEvent constructor is not supported in IE
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
        function CustomEvent (event, params) {
            params = params || { bubbles : false, cancelable : false, detail : undefined };
            const evt = document.createEvent('CustomEvent');

            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        }

        CustomEvent.prototype = window.Event.prototype;

        window.CustomEvent = CustomEvent;
    }
}
