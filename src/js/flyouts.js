/**
 * Fetches the flyouts and appends the HTML to the DOM;
 * The actual animation is done CSS-only
 */
import {h, render} from 'preact'

const URLS = [
  'https://www.radioeins.de/themen/themenflyout.htm/module=themen_flyout.html',
  'https://www.radioeins.de/programm/stundenplan.htm/module=stundenplan_flyout.html'
]

/**
 * Converts the server-sent DOM fragment into a table that's easier to manage 
 * 
 * @param {DOMElement} fragment 
 * @param {DOMElement} container 
 */
function TimeTable (fragment) {
  const currentDayColumn = 1 + ((new Date().getDay() + 1) % 7) // sunday is 0, our sunday is at place 2; friday should be 7
  const currentHour = new Date().getHours()

  const tableHeader = Array.from(fragment.querySelectorAll('.naviflyout a'))
    .map((node, idx) => <th className={idx === currentDayColumn && 'is-current-day'}><a href={node.getAttribute('href')}>{node.textContent.substr(0, 2)}</a></th>)

  const playtimes = Array.from(fragment.querySelectorAll('.timeitem'))
    .map(timeItem =>
      timeItem.innerText
        .trim()
        .replace(/ - \d+:\d+$/g, ''))
    
  // each list element has a class like 'duration3', 'duration5' etc.; we
  // convert this into rowspans
  const parseDuration = li => Number((li.getAttribute('class').match(/duration\d/) || ['duration1'])[0].replace(/duration/, ''))

  // for the scheduled day we return an array like this:
  // [{5: ..., 10: ...}, {5: ..., 8: ...}]
  // each key stands for an hour and the index of the object in the
  // containing array shows the day for which it's scheduled
  const scheduledDays = Array.from(fragment.querySelectorAll('.stundenplanflyout .sendungen'))
    .map((ul, dayIdx) => Object.fromEntries(
      Array.from(ul.querySelectorAll('li'))
        .reduce((acc, li) => {
          const duration = parseDuration(li)
          const [previousStart, previousDuration, _] = acc.length ? acc[acc.length - 1] : [5, 0, 0] // the day starts at 5am
          const previousEnd = previousStart + previousDuration

          const isCurrentDay = dayIdx === currentDayColumn
          const isOnAir = isCurrentDay && currentHour >= previousEnd && currentHour <= previousEnd + duration
          const className = [isCurrentDay ? 'is-current-day' : '', isOnAir ? 'is-on-air' : ''].join(' ')

          return acc.concat([[
            previousEnd,
            duration,
            <td rowspan={duration} className={className}>
              <a href={li.querySelector('a').getAttribute('href')}
                title={li.querySelector('a').getAttribute('title')}>
                {li.textContent.trim()}
              </a>
            </td>
          ]])
        }, [])
        .map(([startTime, _, el]) => [startTime, el])))
    
  const programForDayAtPlaytime = (dayIdx, playtime) =>
    scheduledDays[dayIdx][playtime.replace(/^0/, '').replace(/:.*$/, '')]

  return <table class='program-table'>
    <thead class='program-table--head'>
      <tr>
        <th></th>
        {tableHeader}
      </tr>
    </thead>
    <tbody class='program-table--body'>
      {playtimes.map(time =>
        <tr>
          <td>
            <span class='program-table--playtime'>{time}</span>
          </td>
          {tableHeader.map((_, idx) => programForDayAtPlaytime(idx, time))}
        </tr>
      )}
    </tbody>
  </table>
}

/**
 * Load flyout content and add DOM handlers
 */
export function setup () {
  URLS.forEach(url => {
    const content = url.split('/')[3]

    // fetch flyout structure from the server
    fetch(url)
      .then(res => res.text())
      .then(html => {
        // construct dom node from fetched html
        const fragment = new DOMParser().parseFromString(html, 'text/html').querySelector('body > :first-child')
        const container = document.createElement('div')

        if (content === 'programm') {
          const table = TimeTable(fragment)
          render(table, container)
        } else {
          container.appendChild(fragment)
        }

        container.classList.add('flyout-container', content)

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
