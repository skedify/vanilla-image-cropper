import {MODES} from '../../constants';
import {cell} from '../../utils/Dom';
import {convertGlobalToLocal} from '../../utils/Event';
import Handle from './Handle';
import {hasValue, copyTo} from '../../utils/Object';
import CustomEvent from '../../utils/CustomEvent';

function move (pos, dim) {
    const w = ~~((dim.x2 - dim.x) * .5);
    const h = ~~((dim.y2 - dim.y) * .5);

    if (pos.x - w < 0) pos.x = w;
    if (pos.x + w > dim.w) pos.x = dim.w - w;

    if (pos.y - h < 0) pos.y = h;
    if (pos.y + h > dim.h) pos.y = dim.h - h;

    copyTo(dim, {
        x : pos.x - w,
        x2 : pos.x + w,
        y : pos.y - h,
        y2 : pos.y + h,
    });
}

export default class Handles {
    constructor (scope) {
        if (!hasValue(MODES, scope.options.mode)) throw new TypeError(`Mode ${scope.options.mode} doesnt exist`);

        this.$$view = cell('div', ['imgc-handles', `imgc-handles-${scope.options.mode}`], {}, scope.$$parent);

        for (let i = 0; i < (scope.options.fixed_size ? 4 : 8); i++) {
            new Handle(this.$$view, i, scope);
        }

        function onMouseDown (evt) {
            document.addEventListener('mousemove', documentMouseDown);
            document.addEventListener('mouseup', documentMouseUp);
            changeDimensions(evt);
        }

        function documentMouseDown (evt) {
            changeDimensions(evt);
        }

        function documentMouseUp () {
            document.removeEventListener('mouseup', documentMouseUp);
            document.removeEventListener('mousemove', documentMouseDown);
        }

        function changeDimensions (evt) {
            move(convertGlobalToLocal(evt, scope.$$parent.getBoundingClientRect()), scope.meta.dimensions);
            scope.$$parent.dispatchEvent(new CustomEvent('source:dimensions'));
        }

        this.$$view.addEventListener('mousedown', onMouseDown);
    }

    update ({x, x2, y, y2, w, h}) {
        copyTo(this.$$view.style, {
            top : `${y}px`,
            left : `${x}px`,
            right : `${~~(w - x2)}px`,
            bottom : `${~~(h - y2)}px`,
        });
    }
}
