class LightsOff extends HTMLElement {
  constructor () {
    super()
    this._restart(this.getAttribute('level'))
  }

  static get observedAttributes () {
    return ['level']
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'level') {
      this.reload(newValue)
    }
  }

  set level (val) {
    if (val) {
      this.setAttribute('level', val)
    } else {
      this.removeAttribute('level')
    }
  }

  get level () {
    return this.getAttribute('level')
  }

  connectedCallback () {
    this.innerHTML = LightsOff._getButtonsHtml(this.fields, this._level)
    this.addEventListener('click', this._handleClickOnButton)
  }

  disconnectedCallback () {
    this.removeEventListener('click', this._handleClickOnButton)
  }

  reload (newLevel) {
    newLevel = parseInt(newLevel, 10) || this._level
    this._restart(newLevel || this._level)
    this.innerHTML = LightsOff._getButtonsHtml(this.fields, newLevel)
  }

  _toggleState (index) {
    const indexes = LightsOff._getFieldsToToggle(index, this._level)
    this.fields = LightsOff._toggleFields(indexes, this.fields)
    this._toggleButtons(indexes, this.fields)

    this.dispatchEvent(new CustomEvent('amo-lights-off-move', {
      detail: {
        movesCount: this._movesCount
      }
    }))

    if (this.fields.indexOf(true) === -1) {
      this.dispatchEvent(new CustomEvent('amo-lights-off-end', {
        detail: {
          movesCount: this._movesCount
        }
      }))
    }
  }

  _handleClickOnButton (e) {
    if (e.target.tagName === 'BUTTON') {
      this._movesCount++
      this._toggleState(parseInt(e.target.dataset.index), 10)
    }
  }

  _toggleButtons (indexes, fields) {
    indexes.forEach(index => {
      const button = this.querySelector(`button[data-index="${index}"]`)
      button.setAttribute('isOn', fields[index])
    })
  }

  _restart (newLevel) {
    this._level = newLevel
    this._movesCount = 0

    this.fields = LightsOff.generateFields(this._level)
  }

  static _toggleFields (indexes, fields) {
    return fields.map((field, _index) =>
      indexes.indexOf(_index) > -1 ? !field : field)
  }

  static generateFields (level) {
    const arr = new Array(level * level)
    arr.fill(false)
    arr[0] = true
    arr[1] = true
    arr[level] = true
    return arr
  }

  static _getButtonsHtml (fields, level) {
    return fields.map((field, index) => (
      `${index % level !== 0 ? '' : '<br/>'}<button isOn=${field} data-index="${index}"></button>`
    ))
    .join('')
  }

  static getValidator (_level) {
    return [
      (_index) => _index,
      (_index) => (_index - _level >= 0 ? _index - _level : null),
      (_index) => ((_index + _level <= (_level * _level) - 1) ? _index + _level : null),
      (_index) => (_index % _level > 0 ? _index - 1 : null),
      (_index) => ((_index + 1) % _level > 0 ? _index + 1 : null)
    ]
  }

  static _getFieldsToToggle (index, level) {
    return LightsOff.getValidator(level)
      .reduce((acc, check) => (acc.concat(check(index))), [])
      .filter(item => Number.isInteger(item))
  }
}

export default LightsOff
