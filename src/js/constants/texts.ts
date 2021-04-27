export const TEXTS = {
  RELATED_SHABADS: 'Related Shabads',
  URIS: {
    HOME: 'Home',
    ABOUT: 'About',
    SHABAD: 'Shabad',
    ANG: 'Ang',
    INDEX: 'Index',
    HELP: 'Help',
    TOS: 'Terms of Service',
    SUNDAR_GUTKA: 'Sundar Gutka',
    SUNDAR_GUTKA_BAANI: 'Baani',
    AMRIT_KEERTAN: 'Amrit Keertan',
    MARYADA: 'Rehat Maryadha - Sikh Code of Conduct',
  },
  GDPR_NOTICE: `
    Our service uses cookies to remember your preferences to give a great experience. If you do not agree to SikhiToTheMax's use of cookies, please use your browser's private/incognito mode. Otherwise, by continuing the use of the service, you consent to the use of cookies. Read more <a href="/help#Web-why-does-sikhitothemax-website-use-cookies-and-loc">here</a>.
  `,
  ANDROID: 'Android',
  IOS: 'iOS',
  SEHAJ_PAATH: (ang: string) => `Continue reading Ang ${ang}`,
  SUNDAR_GUTKA_HEADER: `Sundar Gutka Baaniyaan`,
  SUNDAR_GUTKA_APP: `Download Sundar Gutka App for improved experience on`,
  SUNDAR_GUTKA_LENGTHS_INFO: `There are many different variations of certain Baanis out there that people read. To make sure you get the best experience from our website, please choose a setting which best matches your preference.`,
  SUNDAR_GUTKA_LENGTHS_TITLE: `Baani Lengths`,
  SYNC: `Remote Sync`,
  CONTROLLER: 'Bani Controller',
  CONTROLLER_TITLE: 'Take Control of SikhiToTheMax',
  CONTROLLER_DESC: 'Control SikhiToTheMax on your computer using your mobile device. Sit anywhere in the Darbar Hall with the sangat or Keertani while still being able to control SikhiToTheMax. Bani Controller adds more flexibility and mobility to project Gurbani on to the big screen.',
  CONTROLLER_ERROR: (type: string = 'code/pin') =>
    `We aren't able to connect to the desktop with the entered ${type}. Make sure it's correct or try again later.`,
  SYNC_TITLE: 'Sync your phone to SikhiToTheMax',
  SYNC_DESCRIPTION: `Sangat Sync allows you to view the Shabad and current line displayed, via our Desktop Application, on your mobile device. Just enter the code below displayed on the screen by the desktop application and you will have the ability to choose what you want displayed such as translations, transliterations, larivaar and more.`,
  SYNC_ERROR: `We aren't able to connect to the entered code. Make sure it's correct or try again later.`,
  SYNC_NOTIFICATION: (code: string) =>
    `You're now connected to ${code}. Tap to dismiss.`,
  SYNC_CONNECTED: (code: string) =>
    `Awesome! You're now connected to the device "${code}" and will start receiving shabads soon! The screen will automatically update now as shabads and lines change on the desktop.`,
  SYNC_DISCONNECT: `Are you sure you want to disconnect now? You can re-connect by entering the same code later.`,
  OFFLINE: `It seems you aren't connected to internet`,
  OFFLINE_DESCRIPTION: `Unfortunately we don't support offline mode at present. Please connect to the internet to use our website and search Gurbani.`,
  HELP_SECTION: 'the help section',
  INDEX_SECTION: 'the index page',
  GENERIC_ERROR: `ਵਾਹਿਗੁਰੂ! Something isn't working correctly`,
  GENERIC_ERROR_DESCRIPTION: `This is really unusual. Try <a href="https://www.thewindowsclub.com/clear-cache-cookies-specific-website" target="_blank" rel="noreferrer nofollow">clearing your cache</a>. If you still face the issue, you may want to hit the Feedback button at the bottom of this page, and report this issue to our team to fix it.`,
  TIMEOUT_ERROR: `ਵਾਹਿਗੁਰੂ! Network connection timed out`,
  TIMEOUT_ERROR_DESCRIPTION: `This usually happens when your internet connection is either down or very slow. Try connecting sometime later?`,
  GO_TO_SHABAD: 'Go to Shabad',
  HUKAMNAMA: 'Daily Hukamnama',
  HUKAMNAMA_HEADING: 'Daily Hukamnama Sri Harmandir Sahib, Amritsar',
  ANG_NOT_FOUND: `Sorry, we couldn't find the requested ang (page).`,
  ANG_NOT_FOUND_DESCRIPTION: (ang: string, source: string) =>
    `Ang (page) "${ang}" was not found in "${source}". Make sure ang (page) ${ang} is actually present in the selected source. If you still cannot find your shabad, head over to `,
  NO_RESULTS_FOUND: `Sorry, we couldn't find results for your query`,
  NO_RESULTS_FOUND_DESCRIPTION: (source: string, type: string) =>
    `Are you sure you want to search in "${source}" with search type of "${type}"? If not, try changing your search settings from above. If you still cannot find your shabad, head over to `,
  GURBAANI_COPIED: 'Gurbani has been copied to your clipboard!',
  EMBED_COPIED:
    'Embedding code has been copied. Paste it in a rich editor usually found in forums',
  EMBED_FAILURE: "Sorry, we couldn't copy embed code",
  LINK_COPIED: 'Link has been copied to your clipboard!',
  COPY_FAILURE: "Sorry, we couldn't copy the link. Try copying it manually.",
  OPEN_PAGE: 'Open Page',
  PREVIOUS_PAGE: 'Previous Page',
  NEXT_PAGE: 'Next Page',
  PAGE_NOT_FOUND_MESSAGE: 'These are not the Singhs you are looking for.',
  URL_NOT_FOUND: (url: string) =>
    `The requested URL "${url}" was not found on this server.`,
  EMPTY_QUERY: `Oh no! You can't just search for nothing.`,
  EMPTY_QUERY_DESCRIPTION:
    'Please enter your query in the search bar above to give us a chance to serve you.',
  REDIRECTING: 'Redirecting you to',
  REDIRECTING_DESCRIPTION: 'If your browser does not redirect, you may visit',
  RESET: 'Reset to Default',
  SPLIT_VIEW: 'Split View',
  UNICODE: 'Unicode',
  ASSIST: 'Assist',
  FONT: 'Font',
  DISPLAY: 'Display',
  LARIVAAR: 'Larivaar',
  TRANSLATION: 'Translation',
  TRANSLITERATION: 'Transliteration',
  FONT_SIZE: 'Font Size',
  DARK_MODE: 'Dark Mode',
  AUTO_SCROLL_MODE: 'Auto Scroll Mode',
  VISRAAMS: 'Visraams',
  CENTERALIGN: 'Center-Align',
  HUKAMNAMA_NOT_FOUND_DESCRIPTION:
    "We couldn't find the hukamnama for this date in our database.",
  TOGGLE_GURMUKHI_KEYBOARD: "toggle gurmukhi keyboard",
  BACK_TO_HOME: "back to home",
};
