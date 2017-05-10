import {cell} from '../utils/Dom';
import {createEvent} from '../utils/CreateEvent';

export default class Content {
    constructor (scope) {
        this.$$view = cell('div', ['imgc-content'], {}, scope.$$parent);

        this.$$source = cell('img', null, {}, this.$$view);

        //  Load Image
        this.$$source.addEventListener('load', () => {
            const toggle_event = createEvent('source:fetched');
            this.$$source.dispatchEvent(toggle_event);
        });
    }

    source (href) {
        this.$$source.src = href;
    }
}
