import ImageCropper from './imagecrop'

beforeAll(() => {
  window.MutationObserver = class {
    constructor() {} /* eslint-disable-line */
    disconnect() {} /* eslint-disable-line */
    observe() {} /* eslint-disable-line */
  }
})

afterAll(() => {
  window.MutationObserver = undefined
})

describe('ImageCropper', () => {
  let el
  let imgc

  beforeEach(() => {
    el = document.createElement('div')
    el.className = 'test-imagecrop'
    document.body.appendChild(el)

    imgc = new ImageCropper('.test-imagecrop', '../../test/img.jpg')
  })

  afterEach(() => {
    el.parentNode.removeChild(el)
  })

  //  BASICS

  it('should have a function named setImage', () => {
    expect(imgc.setImage).toBeDefined()
  })

  it('should have a function named crop', () => {
    expect(imgc.crop).toBeDefined()
  })

  it('should have a function named destroy', () => {
    expect(imgc.destroy).toBeDefined()
  })

  it('should have a class named imgc', () => {
    expect(el.className).toContain('imgc')
  })
})

describe('ImageCropper - Children', () => {
  let el

  beforeEach(() => {
    el = document.createElement('div')
    el.className = 'test-imagecrop'
    document.body.appendChild(el)
  })

  afterEach(() => {
    el.parentNode.removeChild(el)
  })

  it('should contain img', () => {
    /* eslint-disable-next-line no-new */
    new ImageCropper('.test-imagecrop', '../../test/img.jpg', {
      create_cb: () => {
        const img_el = document.querySelector('.imgc img')

        expect(img_el).not.toBeUndefined()
        expect(img_el.tagName.toLowerCase()).toBe('img')

        expect(img_el.src.split('/').pop()).toBe('img.jpg')
      },
    })
  })

  it('should contain svg', () => {
    /* eslint-disable-next-line no-new */
    new ImageCropper('.test-imagecrop', '../../test/img.jpg', {
      create_cb: () => {
        const img_el = document.querySelector('.imgc svg')

        expect(img_el).not.toBeUndefined()
        expect(img_el.tagName.toLowerCase()).toBe('svg')
      },
    })
  })

  it('should contain handles', () => {
    /* eslint-disable-next-line no-new */
    new ImageCropper('.test-imagecrop', '../../test/img.jpg', {
      create_cb: () => {
        const img_el = document.querySelector('.imgc div.imgc-handles')

        expect(img_el).not.toBeUndefined()
        expect(img_el.tagName.toLowerCase()).toBe('div')
        expect(img_el.className).toContain('imgc-handles')
        expect(img_el.childNodes.length).toBe(8)
      },
    })
  })
})
