import { h, render } from 'preact'
import { useState } from 'preact/hooks'

import openNavLinksSvg from '../assets/mobile/ico-burger-black-mobile.svg'
import closeNavLinksSvg from '../assets/mobile/ico-close-black-mobile.svg'

/**
 * Builds the mobile navigation based on what the active navi looks like
 * and returns JSX that can be mounted wherever we want.
 *
 * @returns {VDom}
 */
function Navigation ({ headerImgSrc, headerHref }) {
  const [visibleSection, setVisibleSection] = useState(null)

  const openSection = section => e => {
    e.preventDefault()
    // close on second click, if not open selected section
    setVisibleSection((visibleSection === section) ? null : section)
  }

  return <nav className='mobile-nav'>
    <div className='mobile-nav-bar'>
      <a href='#' className='mobile-nav-burger-link' onClick={openSection('mobile-nav-links')}>
        <img
          src={visibleSection === 'mobile-nav-links' ? closeNavLinksSvg : openNavLinksSvg}
          title='Navigation' />
      </a>
      <a className='mobile-nav-header-img' href={headerHref}><img src={headerImgSrc} /></a>
      <a className='mobile-nav-live-button' href='#' onClick={openSection('mobile-nav-live')}>Live</a>
    </div>

    {/* Navigation links */}
    <section className={`mobile-nav-section mobile-nav-links ${visibleSection === 'mobile-nav-links' || 'mobile-nav-hidden'}`}>
      <h1>LINKS</h1>
    </section>

    {/* Live section */}
    <section className={`mobile-nav-section mobile-nav-live ${visibleSection === 'mobile-nav-live' || 'mobile-nav-hidden'}`}>
      <h1>LIVE</h1>
    </section>
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
  const liveStream = navigationNode.querySelector('#livestream')

  navigationNode.insertAdjacentElement('afterend', mobileNavContainer)
  render(
    <Navigation
      headerImgSrc={headerNode.querySelector('#headerimage').getAttribute('src')}
      headerHref={headerNode.querySelector('#headerMap area').getAttribute('href')} />,
    mobileNavContainer
  )
}