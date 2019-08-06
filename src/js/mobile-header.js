import { h, render } from 'preact'
import { useState } from 'preact/hooks'

import openNavLinksSvg from '../assets/mobile/ico-burger-black-mobile.svg'
import closeNavLinksSvg from '../assets/mobile/ico-close-mobile.svg'

// TODO: Livestream, Tippspiel, playlist, search

/**
 * Builds the mobile navigation based on what the active navi looks like
 * and returns JSX that can be mounted wherever we want.
 *
 * @returns {VDom}
 */
function Navigation ({ headerImgSrc, headerHref, naviLinks }) {
  const [visibleSection, setVisibleSection] = useState(null)

  const openSection = section => e => {
    e.preventDefault()
    // close on second click, if not open selected section
    setVisibleSection((visibleSection === section) ? null : section)
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
      <a className={`mobile-nav-live-button ${visibleSection === 'mobile-nav-live' && 'mobile-nav-button-open'}`} href='#' onClick={openSection('mobile-nav-live')}>Live</a>
    </div>

    {/* Navigation links */}
    <section className={`mobile-nav-section ${visibleSection === 'mobile-nav-links' || 'mobile-nav-hidden'}`}>
      <ul className='mobile-nav-links'>
        {/* The reason this isn't hardcoded is so we can swap out items / links more easily */}
        {naviLinks.map(([label, href]) =>
          <li className='mobile-nav-link-item'><a href={href}>{label}</a></li>)}
      </ul>
    </section>

    {/* TODO: Live section */}
    <section className={`mobile-nav-section mobile-nav-live ${visibleSection === 'mobile-nav-live' || 'mobile-nav-hidden'}`}>
      <h1>LIVE</h1>
    </section>
  </nav>
}

const attr = (node, selector, attribute) => node.querySelector(selector).getAttribute(attribute)

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
      naviLinks={[
        ['Programm', attr(navigationNode, 'a[title=Programm]', 'href')],
        ['Videos', attr(navigationNode, 'a[title=Videos]', 'href')],
        ['Musik', attr(navigationNode, 'a[title=Musik]', 'href')],
        ['Podcasts', attr(navigationNode, 'a[title=Podcasts]', 'href')]
      ]} />,
    mobileNavContainer
  )
}
