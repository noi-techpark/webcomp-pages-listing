import { LitElement, html } from 'lit-element';
import _ from 'lodash';

import { renderFonts, ensureFonts } from './lib/typography.js';
import { renderContents } from './lib/contents.js';

import fonts__suedtirol_next_woff from './fonts/SuedtirolNextTT.woff';
import fonts__suedtirol_next_woff2 from './fonts/SuedtirolNextTT.woff2';
import fonts__kievit_regular_woff from './fonts/Kievit.woff';
import fonts__kievit_bold_woff from './fonts/Kievit-Bold.woff';

import styles__normalize from 'normalize.css/normalize.css';
import styles from './listing.scss';

import assets__dot_icon from './images/dot.svg';

const fonts = [
  {
    name: 'pages-suedtirol-next',
    woff: fonts__suedtirol_next_woff,
    woff2: fonts__suedtirol_next_woff2,
    weight: 400
  },
  {
    name: 'pages-kievit',
    woff: fonts__kievit_regular_woff,
    weight: 400
  },
  {
    name: 'pages-kievit',
    woff: fonts__kievit_bold_woff,
    weight: 700
  }
];

class ListingElement extends LitElement {

  constructor() {
    super();

    this.srcUrl = '';
    this.layoutName = 'end';
  }

  static get properties() {
    return {
      srcUrl: { attribute: 'src', type: String },
      layoutName: { attribute: 'layout', type: String }
    };
  }

  render() {
    return html`
      <style>
        ${renderFonts(fonts)}
        ${styles__normalize}
        ${styles}
      </style>
      <div id="wrapper">
        <div id="container" class="${!!this.layoutName ? 'is-' + this.layoutName + '-layout' : ''}">
          <div id="box">
            <div id="contains-image">
              <div id="image"></div>
              <div id="copyright">
                <span id="copyright-text"></span>
              </div>
            </div>
            <div id="contains-contents">
              <div id="contents">
                <div id="text"></div>
                <div id="contains-items">
                  <ul id="items"></ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async firstUpdated() {
    let self = this;
    let root = self.shadowRoot;

    ensureFonts(fonts);

    if (!!self.srcUrl) {
      fetch(self.srcUrl).then((response) => {
        return response.json();
      }).then((data) => {
        let imageContainer = root.getElementById('contains-image');
        let imageElement = root.getElementById('image');

        if (!!data.image) {
          imageContainer.classList.add('is-defined');
          imageElement.style.backgroundImage = 'url(' + data.image.src + ')';
        }

        let copyright = root.getElementById('copyright');
        let copyrightText = root.getElementById('copyright-text');

        if (!!data.image && !!data.image.copyright) {
          copyright.classList.add('is-defined');
          copyrightText.innerHTML = '&copy; ' + data.image.copyright;
        }

        let textContainer = root.getElementById('text');
        textContainer.innerHTML = renderContents(data.contents || '');

        if (!!data.items) {
          let itemsList = root.getElementById('items');
          itemsList.innerHTML = '';

          _.each(data.items, (item, i) => {
            var bulletText = document.createElement('span');
            bulletText.textContent = (i + 1);

            var bullet = document.createElement('div');
            bullet.classList.add('contains-bullet');
            bullet.style.backgroundImage = 'url(data:image/svg+xml;base64,' + btoa(assets__dot_icon) + ')';
            bullet.appendChild(bulletText);

            var content = document.createElement('div');
            content.classList.add('contains-content');
            content.innerHTML = renderContents(item.contents || '');

            var li = document.createElement('li');
            li.appendChild(bullet);
            li.appendChild(content);

            itemsList.appendChild(li);
          });
        }
      });
    }
  }

}

if (!customElements.get('pages-listing')) {
  customElements.define('pages-listing', ListingElement);
}