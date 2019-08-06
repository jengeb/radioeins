import { h, render } from 'preact'
import { useState, useEffect } from 'preact/hooks'

import openNavLinksSvg from '../assets/mobile/ico-burger-black-mobile.svg'
import closeNavLinksSvg from '../assets/mobile/ico-close-mobile.svg'

// TODO: Livestream, Tippspiel, playlist, search

/**
 * Fetches the flyout html and creates the DOM needed to mount it
 *
 * @returns {VDom}
 */
function ThemenFlyout ({ isVisible }) {
  const [flyoutHtml, setFlyoutHtml] = useState(null)

  // fetch flyout markup on mount; we display it later
  useEffect(() => {
    if (flyoutHtml == null) {
      fetch('https://www.radioeins.de/themen/themenflyout.htm/module=themen_flyout.html')
        .then(res => res.text())
        .then(html => new DOMParser().parseFromString(html, 'text/html').querySelector('body > :first-child'))
        .then(node => setFlyoutHtml(node.outerHTML))
    }
  })

  return isVisible ? <div dangerouslySetInnerHTML={{ __html: flyoutHtml }} /> : null
}

/**
 * Helper to fetch a nested attribute's value from within a node
 *
 * @param {*} node
 * @param {*} selector
 * @param {*} attribute
 * @returns {string}
 */
const attr = (node, selector, attribute) => node.querySelector(selector).getAttribute(attribute)

/**
 * Builds the mobile navigation based on what the active navi looks like
 * and returns JSX that can be mounted wherever we want.
 *
 * @returns {VDom}
 */
function Navigation ({ headerImgSrc, headerHref, naviLinks, liveLink }) {
  const [visibleSection, setVisibleSection] = useState(null)
  const [themenFlyoutVisible, setThemenFlyoutVisible] = useState(false)

  const openSection = section => e => {
    e.preventDefault()
    // close on second click, if not open selected section
    setVisibleSection((visibleSection === section) ? null : section)
  }

  const openLiveLink = e => {
    e.preventDefault()
    window.open(liveLink, 'player', 'width=270,height=415')
  }

  const toggleThemenFlyout = e => {
    e.preventDefault()
    setThemenFlyoutVisible(!themenFlyoutVisible)
  }

  return <nav className='mobile-nav'>
    <div className='mobile-nav-bar'>
      <a
        href='#'
        className={`mobile-nav-burger-button ${visibleSection === 'mobile-nav-links' && 'mobile-nav-button-open'}`}
        onClick={openSection('mobile-nav-links')}>
        <img
          src={visibleSection === 'mobile-nav-links' ? closeNavLinksSvg : openNavLinksSvg}
          title='Navigation' />
      </a>
      <a className='mobile-nav-header-img' href={headerHref}><img src={headerImgSrc} /></a>
      {/* NOTE: Live stream is implemented as a popup, this is different to the designs */}

      <a className={`mobile-nav-live-button ${visibleSection === 'mobile-nav-live' && 'mobile-nav-button-open'}`} href={liveLink} onClick={openLiveLink}>Live</a>
    </div>

    {/* Navigation links */}
    <section className={`mobile-nav-section ${visibleSection === 'mobile-nav-links' || 'mobile-nav-hidden'}`}>
      <ul className='mobile-nav-links'>
        {/* The reason this isn't hardcoded is so we can swap out items / links more easily */}
        {naviLinks.map(([label, href]) =>
          <li className='mobile-nav-item mobile-nav-item-link'><a href={href}>{label}</a></li>)}
        {/* Themen flyout */}
        <li className='mobile-nav-item themen-flyout-link'>
          <a href='#' onClick={toggleThemenFlyout}>Themen</a>
          <ThemenFlyout isVisible={themenFlyoutVisible} />
        </li>
      </ul>
    </section>

    {/* NOTE: Live stream is implemented as a popup, this is different to the designs */}
    {/* <section className={`mobile-nav-section mobile-nav-live ${visibleSection === 'mobile-nav-live' || 'mobile-nav-hidden'}`}>
      <h1>LIVE</h1>
    </section> */}
  </nav>
}


/**
 * Constructs the mobile navigation and mounts it after our current navigation
 */
export function setup () {
  const mobileNavContainer = document.createElement('div')
  mobileNavContainer.setAttribute('id', 'mobile-nav')

  const headerNode = document.querySelector('#header')
  const navigationNode = document.querySelector('#navigationmain')

  navigationNode.insertAdjacentElement('afterend', mobileNavContainer)
  render(
    <Navigation
      headerImgSrc={attr(headerNode, '#headerimage', 'src')}
      headerHref={attr(headerNode, '#headerMap area', 'href')}
      liveLink={attr(navigationNode, '#jetzt a', 'href')}
      naviLinks={[
        ['Programm', attr(navigationNode, 'a[title=Programm]', 'href')],
        ['Videos', attr(navigationNode, 'a[title=Videos]', 'href')],
        ['Musik', attr(navigationNode, 'a[title=Musik]', 'href')],
        ['Podcasts', attr(navigationNode, 'a[title=Podcasts]', 'href')]
      ]} />,
    mobileNavContainer
  )
}
