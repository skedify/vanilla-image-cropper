import Content from './components/Content'
import Handles from './components/handles/index'
import Overlay from './components/Overlay'

import { hasValue, copyTo } from './utils/Object'
import { cell, isElement } from './utils/Dom'
import { addClass, removeClass } from './utils/ClassList'
import { MODES, STATES } from './constants'

const scopes = {}

function __scope(id, opts) {
  let _state = STATES.OFFLINE

  const scope = Object.seal(
    Object.defineProperties(
      {
        $$parent: null,
        el_content: null,
        el_handles: null,
        el_overlay: null,
        meta: {
          dimensions: {
            x: 0,
            x2: 0,
            y: 0,
            y2: 0,
            w: 0,
            h: 0,
          },
          ratio: {
            w: 1,
            h: 1,
          },
        },
        options: {
          update_cb: () => undefined,
          create_cb: () => undefined,
          destroy_cb: () => undefined,
          min_crop_width: 100,
          min_crop_height: 100,
          max_width: 500,
          max_height: 500,
          fixed_size: false,
          mode: MODES.SQUARE,
        },
      },
      {
        state: {
          get: () => _state,
          set: state => {
            _state = state
            if (scope.$$parent)
              scope.$$parent.setAttribute('data-imgc-state', state)
          },
        },
      }
    )
  )

  //  Parse options into the scope
  copyTo(scope.options, opts)

  scopes[id] = Object.seal(scope)

  return scope
}

function __update(evt) {
  /* eslint-disable-next-line no-invalid-this */
  const scope = scopes[this.$$id]

  if (scope.state !== STATES.READY) {
    return
  }

  if (evt) {
    evt.stopPropagation()
  }

  const { dimensions: dim } = scope.meta

  //  boundary collision checks
  if (dim.x < 0) {
    dim.x = 0
  }

  if (dim.y < 0) {
    dim.y = 0
  }

  if (dim.x2 > dim.w) {
    dim.x2 = dim.w
  }

  if (dim.y2 > dim.h) {
    dim.y2 = dim.h
  }

  //  Patch updates
  scope.el_overlay.update(dim, scope.options)
  scope.el_handles.update(dim, scope.options)

  scope.options.update_cb(dim)
}

function __render() {
  /* eslint-disable-next-line no-invalid-this */
  const scope = scopes[this.$$id]

  if (scope.state !== STATES.LOADING) {
    return
  }

  const img = scope.el_content.$$source

  //  Calculate width and height based on max-width and max-height
  let { naturalWidth: w, naturalHeight: h } = img
  const { max_width: max_w, max_height: max_h } = scope.options

  if (w > max_w) {
    h = Math.floor((max_w * h) / w)
    w = max_w
  }

  if (h > max_h) {
    w = Math.floor((max_h * w) / h)
    h = max_h
  }

  //  Set ratio to use in processing afterwards ( this is based on original image size )
  scope.meta.ratio = {
    w: Math.floor((img.naturalWidth / w) * 100) / 100,
    h: Math.floor((img.naturalHeight / h) * 100) / 100,
  }

  //  Set width/height
  scope.meta.dimensions.w = w
  img.width = w

  scope.meta.dimensions.h = h
  img.height = h

  scope.state = STATES.READY

  //  Initialize dimensions
  if (scope.options.fixed_size) {
    const { min_crop_width: mcw, min_crop_height: mch } = scope.options
    const rad = (mcw > mch ? mcw : mch) * 0.5

    copyTo(scope.meta.dimensions, {
      x: w * 0.5 - rad,
      x2: w * 0.5 + rad,
      y: h * 0.5 - rad,
      y2: h * 0.5 + rad,
    })
  } else {
    copyTo(scope.meta.dimensions, {
      x2: w,
      y2: h,
    })
  }

  /* eslint-disable-next-line no-invalid-this */
  __update.call(this)

  scope.options.create_cb({ w, h })
}

export default class ImageCropper {
  constructor(selector, href, opts = {}) {
    if (!href || !selector) {
      return
    }

    this.$$id = Math.random()
      .toString(36)
      .substring(2)

    const scope = __scope(this.$$id, opts)

    //  Set parent
    const el = document.querySelector(selector)

    if (!isElement(el)) {
      throw new TypeError('Does the parent exist?')
    }

    //  Setup parent
    scope.$$parent = el
    addClass(scope.$$parent, 'imgc')

    // MutationObserver replaces DOMNodeRemovedFromDocument event since this is deprecated and doesn't work in IE/Firefox
    this.observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (
          mutation.addedNodes.length === 0 &&
          mutation.removedNodes.length > 0
        ) {
          this.destroy()
        }
      })
    })
    this.observer.observe(scope.$$parent.parentNode, {
      childList: true,
      subtree: true,
    })

    scope.$$parent.addEventListener('source:fetched', __render.bind(this), true)
    scope.$$parent.addEventListener(
      'source:dimensions',
      __update.bind(this),
      true
    )

    //  Create Wrapper elements
    scope.el_content = new Content(scope)
    scope.el_overlay = new Overlay(scope)
    scope.el_handles = new Handles(scope)

    this.setImage(href)
  }

  setImage(href) {
    const scope = scopes[this.$$id]

    scope.state = STATES.LOADING
    scope.el_content.source(href)
  }

  destroy() {
    const scope = scopes[this.$$id]

    // The observer needs to be disconnected so the mutations inside the observer are cleared.
    this.observer.disconnect()

    scope.state = STATES.OFFLINE

    if (isElement(scope.$$parent)) {
      /* eslint-disable-next-line better/no-whiles */
      while (scope.$$parent.firstChild) {
        scope.$$parent.removeChild(scope.$$parent.firstChild)
      }

      //  Clean parent
      removeClass(scope.$$parent, 'imgc')
    }

    scope.options.destroy_cb()

    /* eslint-disable-next-line */
    delete scopes[this.$$id]
  }

  crop(mime_type = 'image/jpeg', quality = 1) {
    const scope = scopes[this.$$id]

    const newMimeType = hasValue(['image/jpeg', 'image/png'], mime_type)
      ? 'image/jpeg'
      : mime_type

    const newQuality = quality < 0 || quality > 1 ? 1 : quality

    const { x, y, x2, y2 } = scope.meta.dimensions
    const { w: rw, h: rh } = scope.meta.ratio
    const w = x2 - x //  width
    const h = y2 - y //  height

    const canvas = cell('canvas', null, {
      width: w,
      height: h,
    })

    canvas
      .getContext('2d')
      .drawImage(
        scope.el_content.$$source,
        rw * x,
        rh * y,
        rw * w,
        rh * h,
        0,
        0,
        w,
        h
      )

    return canvas.toDataURL(newMimeType, newQuality)
  }
}
