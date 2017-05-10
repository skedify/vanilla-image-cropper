export function createEvent(event_type) {
    let toggle_event = null;
    try {
        toggle_event = new CustomEvent(event_type);
    }
    catch (error) {
        toggle_event = document.createEvent("CustomEvent");
        const can_bubble = true;
        const cancelable = true;
        const detail = null;
        toggle_event.initCustomEvent(event_type, can_bubble, cancelable, detail);
    }
    return toggle_event;
}