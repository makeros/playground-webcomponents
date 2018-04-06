window.customElements.define('amo-ping-pong', class extends HTMLElement {
  connectedCallback () {
    this.addEventListener('click', (e) => {
      console.log(e.target)
      if (e.target.hasAttribute('ping') || e.target.hasAttribute('pong')) {
        this._toggleAllButtons()
      }
    })
  }

  _toggleAllButtons () {
    const buttonsPing = this.querySelectorAll('button[ping]')
    const buttonsPong = this.querySelectorAll('button[pong]')

    this._changeButton(buttonsPong, 'pong', 'ping')
    this._changeButton(buttonsPing, 'ping', 'pong')
  }

  _changeButton (elements, from, to) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].removeAttribute(from)
      elements[i].setAttribute(to, true)
    }
  }

  disconnectedCallback () {

  }
})
