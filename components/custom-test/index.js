
//
// 1. whenDefined test with delay?
// 2. attribute changening
// 3. lifecycle callback test
//  - adopted - iframe.contentDocument.body($0)
class CustomTest extends HTMLElement {
  static get observedAttributes () { return ['color'] }

  get color () {
    return this.getAttribute('color')
  }

  set color (value) {
    if (value) {
      this.setAttribute('color', value)
    } else {
      this.removeAttribute('color')
    }
  }

  attributeChangedCallback (name, oldValue, newValue) {
    console.log(`${this.localName} is changing attribute ${name}`)
    if (name === 'color') {
      this.innerText = `The old ${oldValue} is history, now it's ${newValue}'s time!`
      this.style['background-color'] = newValue
    }
  }

  connectedCallback () {
    console.log(`${this.localName} Im now upgraded and connected to the tree`)
    this.innerText = 'Im now upgraded and connected to the tree :)'
  }

  disconnectedCallback () {
    console.log(`${this.localName} Im now disconnected from the tree`)
  }

  adoptedCallback (oldDocument, newDocument) {
    console.log(`${this.localName} has been adopted from ${oldDocument} into ${newDocument}`)
  }
}

setTimeout(function () {
  window.customElements.define('amo-custom-test', CustomTest)
}, 3000)
