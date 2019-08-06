import 'core-js/stable' // polyfill for some es6 features
import 'whatwg-fetch' // polyfill for window.fetch

import * as flyouts from './flyouts'
import * as mobileHeader from './mobile-header'

//
// Run this on every page
//

document.addEventListener('DOMContentLoaded', event => {
  flyouts.setup()
  mobileHeader.setup()
})
