/**
 * Fetches the flyouts and appends the HTML to the DOM;
 * The actual animation is done CSS-only
 */

const URLS = [
  'https://www.radioeins.de/themen/themenflyout.htm/module=themen_flyout.html',
  'https://www.radioeins.de/programm/stundenplan.htm/module=stundenplan_flyout.html'
]

export function setup () {
  URLS.forEach(url => {
    const content = url.split('/')[3]

    // fetch flyout structure from the server
    fetch(url)
      .then(res => res.text())
      .then(html => {
        // construct dom node from fetched html
        const fragment = new DOMParser().parseFromString(html, 'text/html').querySelector('ul')
        const container = document.createElement('div')
        container.classList.add('flyout-container', content)
        container.appendChild(fragment)

        // insert after navigation
        document.querySelector('.containerNavigationMain')
          .insertAdjacentElement('afterend', container)
      })
  })

  // set up click listener
  const VISIBLE_CLASS = 'flyout-visible'

  document.querySelectorAll('[id$=flyout]')
    .forEach(node => {
      const content = node.getAttribute('title').toLowerCase()
      node.addEventListener('click', e => {
        // hide other flyouts
        document.querySelector(`.flyout-container:not(.${content})`)
          .classList
          .remove(VISIBLE_CLASS)

        // show the correct one
        const flyoutNode = document.querySelector(`.flyout-container.${content}`)

        if (flyoutNode == null) {
          console.warn('Flyout node not found')
          return true
        }

        node.parentNode.classList.toggle(VISIBLE_CLASS)
        flyoutNode.classList.toggle(VISIBLE_CLASS)
        e.preventDefault()
        e.stopPropagation()
        return false
      })
    })
}
