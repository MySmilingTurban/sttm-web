import marinate from 'marinate';
import fs from 'fs';
import { resolve } from 'path';
import { ONLINE_COLOR } from '../common/constants';

let manifest;
try {
  manifest = JSON.parse(
    fs.readFileSync(
      resolve(__dirname, '../', 'public', 'assets', 'js', 'manifest.json'),
      'utf-8'
    )
  );
} catch (err) {
  // console.error(err, ' mani fest error')
}

/*
<html lang="en">
TODO: language attribute is hard coded for now, make it dynamic when actual language support is added.
*/
export default ({ url, bodyClass, title, description, language }) => marinate`
<!DOCTYPE html>
<html lang="${language}">
<head>
  <title>${title}</title>
  <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
  <link type="application/opensearchdescription+xml" rel="search" href="/osdd.xml"/>
  <link rel="manifest" href="/manifest.json" />
  ${preconnectHTML}
  ${preloadFontsHTML}
  ${preloadScriptsHTML}
  ${prefetchImagesHTML}

  <!-- Meta Tags -->
  <meta charset="utf-8" />
  <meta name="theme-color" content="${ONLINE_COLOR}" />
  <meta name="description" content="${description}" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="apple-itunes-app" content="app-id=431446112" />
  <meta name="google-play-app" content="app-id=com.WahegurooNetwork.SundarGutka" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://www.sikhitothemax.org${url}" />
  <meta property="og:author" content="https://khalisfoundation.org/" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="/assets/images/sttm_banner.png" />
  <meta property="og:image:width" content="1500" />
  <meta property="og:image:height" content="1000" />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:site" content="@khalisfound" />
  <meta property="twitter:creator" content="@khalisfound" />
  <meta property="twitter:title" content="${title}" />
  <meta property="twitter:description" content="${description}"/>
  <meta property="twitter:image:src" content="/assets/images/sttm_banner.png" />
  <meta property="twitter:image:width" content="1500" />
  <meta property="twitter:image:height" content="1000" />

  <!-- Safari iOS config -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <meta name="apple-mobile-web-app-title" content="STTM">
  <link rel="apple-touch-icon" href="/assets/images/apple-touch-icon-precomposed.png">

  <!-- Windows Tile -->
  <meta name="msapplication-config" content="ieconfig.xml">
  <meta name="application-name" content="STTM">

  <link rel="android-touch-icon" href="/assets/images/apple-touch-icon-precomposed.png">
  ${stylesheetsHTML}
</head>

<body data-testid="bodyElement" class="${bodyClass}">
  <div id="toast-notification" class="toast-notification hidden"></div>

  <div id="app-root"></div>

  <!-- Google Analytics -->
  <script>
    var ga;
    if (document.location.hostname === 'www.sikhitothemax.org') {
      /* GA script here */
      (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
          (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date(); a = s.createElement(o),
          m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
      })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
    } else {
      ga = function () { console.log('ga:', Array.prototype.slice.call(arguments)); };
    }
    ga('create', 'UA-47386101-5', 'auto');
  </script>

  <script async src="https://www.googletagmanager.com/gtag/js?id=AW-958770124"></script> <script> window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'AW-958770124'); </script>

  <!-- Polyfills -->
  <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=fetch,Object.entries,Array.from,Array.prototype.includes,String.prototype.startsWith,String.prototype.includes,Map,Set,requestAnimationFrame,Array.prototype.@@iterator"></script>

  <!-- Source Code -->
  ${scriptsHTML}

  <!-- ServiceWorker -->
  <script>
    if ("serviceWorker" in navigator) {
      ${process.env.kill_service_worker
    ? unregisterServiceWorker
    : registerServiceWorker
  }
    }
  </script>
  <script>
    var d = new Date();
    document.getElementById("year").innerHTML = d.getFullYear();
  </script>

<!-- freshwork widget -->
<script> window.fwSettings={ 'widget_id':63000000151 }; !function(){if("function"!=typeof window.FreshworksWidget){var n=function(){n.q.push(arguments)};n.q=[],window.FreshworksWidget=n}}() </script> <script type='text/javascript' src='https://widget.freshworks.com/widgets/63000000151.js' async></script>

<noscript>
  ${noScriptHTML}
 </noscript>


</body>
</html>
`;

const preconnect = ['//cdn.polyfill.io', '//api.banidb.com'];
const preconnectHTML = preconnect
  .map(
    d =>
      `<link rel="preconnect" href="${d}" crossorigin /><link rel="dns-prefetch" href="${d}" />`
  )
  .join('');

const prefetchImages = [
  '/assets/images/sttm_logo.png',
  '/assets/images/logo-192x192.png',
];
const prefetchImagesHTML = prefetchImages
  .map(i => `<link async rel="prefetch" href="${i}" as="image" />`)
  .join('');

const preloadFonts = [
  '/assets/fonts/AnmolLipiSG.ttf?v=1',
  '/assets/fonts/GurbaniAkharHeavyTrue.ttf?v=1',
];
const preloadFontsHTML = preloadFonts
  .map(f => `<link async rel="preload" href="${f}" as="font" crossorigin />`)
  .join('');

const stylesheets = [
  '/assets/css/vendor/foundation.min.css?v=6.2.4',
  '/assets/css/bundle.css',
  'https://fonts.googleapis.com/css?family=Muli:300&display=swap',
  'https://fonts.googleapis.com/css?family=Lato&display=swap',
];
const stylesheetsHTML = stylesheets
  .map(s => `<link href="${s}" rel="stylesheet" />`)
  .join('');

const scripts = manifest ? [manifest['vendor.js'], manifest['app.js']] : [];
const scriptsHTML = scripts.map(s => `<script src="${s}"></script>`).join('');
const preloadScriptsHTML = scripts
  .map(s => `<link async rel="preload" href="${s}" as="script" />`)
  .join('');

const registerServiceWorker = `
  navigator.serviceWorker
    .register('service-worker.js', { scope: './' })
    .then(reg => console.log('Registration succeeded. Scope is ' + reg.scope))
    .catch(console.error);
`;

const unregisterServiceWorker = `
  navigator.serviceWorker
    .getRegistrations()
    .then(sws => sws.forEach(s => s.unregister()))
`;

const noScriptHTML = `
<div class="error-message">
  <div>
    <h3>JavaScript is essential to use our website. Kindly enable it.</h3>
    <section>
      We're sorry for the inconvenience. Follow the instructions <a href="https://www.enable-javascript.com" target="_blank" rel="noreferrer nofollow">here</a> if you're confused how to enable JavaScript.
    </section>
  </div>
  <div>
    <img src="/assets/images/Sach Kaur.png" alt="Image of a Sikh Girl face-palming">
  </div>
</div>
`;
