import 'core-js/stable' // polyfill for some es6 features
import 'whatwg-fetch' // polyfill for window.fetch

import * as flyouts from './flyouts'

//
// Run this on every page
//

document.addEventListener('DOMContentLoaded', event => {
  flyouts.setup()
})
