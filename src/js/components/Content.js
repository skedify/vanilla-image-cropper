import {cell} from '../utils/Dom';
import CustomEvent from '../utils/CustomEvent';

export default class Content {
    constructor (scope) {
        this.$$view = cell('div', ['imgc-content'], {}, scope.$$parent);

        this.$$source = cell('img', null, {}, this.$$view);

        //  Load Image
        this.$$source.addEventListener('load', () => {
            this.$$source.dispatchEvent(new CustomEvent('source:fetched'));
        });
    }

    source (href) {
        this.$$source.src = href;
    }
}
