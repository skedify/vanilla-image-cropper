const arrIndexOf =
  Array.prototype.indexOf ||
  function arrIndexOf(item) {
    /* eslint-disable-next-line better/no-fors,no-invalid-this */
    for (let i = 0, { length } = this; i < length; i++) {
      /* eslint-disable-next-line no-invalid-this */
      if (i in this && this[i] === item) {
        return i
      }
    }

    return -1
  }

function DOMEx(type, message) {
  this.name = type
  this.code = DOMException[type]
  this.message = message
}

DOMEx.prototype = Error.prototype

function deriveClasses(element) {
  return (element.getAttribute('class') || '').split(/\s+/)
}

function checkTokenAndGetIndex(class_list, token) {
  if (token === '') {
    throw new DOMEx('SYNTAX_ERR', 'An invalid or illegal string was specified')
  }

  if (/\s/.test(token)) {
    throw new DOMEx(
      'INVALID_CHARACTER_ERR',
      'String contains an invalid character'
    )
  }

  return arrIndexOf.call(class_list, token)
}

function setClassName(element, tokens) {
  element.setAttribute('class', tokens.join(' '))
}

export function addClass(element, class_name) {
  const classes = deriveClasses(element)

  if (checkTokenAndGetIndex(classes, class_name) === -1) {
    classes.push(class_name)
    setClassName(element, classes)
  }
}

export function removeClass(element, class_name) {
  const classes = deriveClasses(element)
  const index = checkTokenAndGetIndex(classes, class_name)

  if (index !== -1) {
    classes.splice(index, 1)
    setClassName(element, classes)
  }
}
