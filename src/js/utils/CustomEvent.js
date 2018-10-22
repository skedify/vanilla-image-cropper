const CustomEvent =
  /* eslint-disable-next-line better/no-typeofs */
  typeof window.CustomEvent === 'function'
    ? window.CustomEvent
    : Object.defineProperties(
        function CustomEvent(event, params) {
          const eventParams = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined,
          }
          const evt = document.createEvent('CustomEvent')

          evt.initCustomEvent(
            event,
            eventParams.bubbles,
            eventParams.cancelable,
            eventParams.detail
          )
          return evt
        },
        {
          prototype: {
            value: window.Event.prototype,
            writable: false,
            configurable: false,
          },
        }
      )

export default CustomEvent
