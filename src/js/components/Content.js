import {cell} from '../utils/Dom';
import {createEvent} from '../utils/CreateEvent';

export default class Content {
    constructor (scope) {
        this.$$view = cell('div', ['imgc-content'], {}, scope.$$parent);

        this.$$source = cell('img', null, {}, this.$$view);

        //  Load Image
        this.$$source.addEventListener('load', () => {
            this.$$source.dispatchEvent(createEvent('source:fetched'));
        });
    }

    source (href) {
        this.$$source.src = href;
    }
}
