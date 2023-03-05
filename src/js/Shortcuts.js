import store from './features/store';
import { selectItemInArray, toggleFullScreenMode as toggleFSMode } from './util';
import { toFixedFloat } from './util';

const ViewerShortcuts = {
  toggleLarivar: {
    name: 'Toggle Larivar',
    sequences: ['l', 'f+l'],
  },
  toggleLarivarAssist: {
    name: 'Toggle Larivar Assist',
    sequences: ['shift+l'],
  },
  toggleVishraams: {
    name: 'Toggle Vishraams',
    sequences: ['v', 'f+v'],
  },
  toggleAutoScrollMode: {
    name: 'Toggle AutoScroll Mode',
    sequences: ['a','f+a'],
  },
  toggleDarkMode: {
    name: 'Toggle Dark Mode',
    sequences: ['o','f+o'],
  },
  toggleSplitMode: {
    name: 'Toggle Split Mode',
    sequences: ['/','f+/'],
  },
  toggleFullScreenMode: {
    name: 'Toggle FullScreen Mode',
    sequences: ['f'],
  },
  toggleReadingMode: {
    name: 'Toggle Reading Mode', // SehajPaath Mode
    sequences: ['r','f+r'],
  },
  unicode: {
    name: 'Unicode',
    sequences: ['u','f+u'],
  },
  centerAlign: {
    name: 'Center Align',
    sequences: ['meta+shift+c', 'ctrl+shift+c'],
  },
  toggleEngTranslation: {
    name: 'Toggle English Translation',
    sequences: ['e','f+e'], // alt + e = Dead, accoring to hotkeys handler
  },
  togglePunjabiTranslation: {
    name: 'Toggle Punjabi Translation',
    sequences: ['t','f+t'],
  },
  toggleSpanishTranslation: {
    name: 'Toggle Spanish Translation',
    sequences: ['s','f+s'],
  },
  toggleEngTranslit: {
    name: 'Toggle English Transliteration',
    sequences: ['shift+e','f+shift+e'],
  },
  toggleShahTranslit: {
    name: 'Toggle Shahmukhi Transliteration',
    sequences: ['shift+s','f+shift+s'],
  },
  toggleHinTranslit: {
    name: 'Toggle Hindi Transliteration',
    sequences: ['shift+h','f+shift+h'],
  },
  increaseFontSize: {
    name: 'Increase Font Size',
    sequences: ['+'],
  },
  decreaseFontSize: {
    name: 'Decrease Font Size',
    sequences: ['-'],
  },
};
const GlobalShortcuts = {
  toggleSearchBar: {
    name: 'activate search bar',
    sequences: ['meta+/', 'ctrl+/'],
  },
};

const GlobalHandlers = {
  toggleSearchBar: (e) => {
    e.preventDefault();
    const searchbar = document.querySelector('#search');

    searchbar.focus();
    searchbar.value = '';
  },
};
const ViewerShortcutHanders = {
  toggleLarivar: (event) => {
    /*
      NOTE:
      added exception to handle Ctrl/command(mac)+l key combination.
      it shouldn't toggle Larivaar with Ctrl/command(mac)+l combination.
    */
    const isMeta = event?.metaKey;
    if (!isMeta) {
      store.dispatch({ type: 'TOGGLE_LARIVAAR_OPTION' });
    }
  },
  toggleLarivarAssist: () => {
    store.dispatch({ type: 'TOGGLE_LARIVAAR_ASSIST_OPTION' });
  },
  toggleVishraams: () => {
    store.dispatch({ type: 'TOGGLE_VISRAAMS' });
  },
  toggleAutoScrollMode: () => {
    store.dispatch({ type: 'TOGGLE_AUTO_SCROLL_MODE' });
  },
  toggleDarkMode: () => {
    store.dispatch({ type: 'TOGGLE_DARK_MODE' });
  },
  toggleSplitMode: () => {
    store.dispatch({ type: 'TOGGLE_SPLIT_VIEW_OPTION' });
  },
  toggleReadingMode: () => {
    store.dispatch({ type: 'TOGGLE_SEHAJ_PAATH_MODE' });
  },
  toggleFullScreenMode: (e) => {
    const state = store.getState();
    store.dispatch({
      type: 'SET_FULLSCREEN_MODE',
      payload: !state.fullScreenMode,
    });
    try {
      toggleFSMode(!state.fullScreenMode);
    } catch(err) {
      // eslint-disable-next-line no-console
      console.warn(err.message,' SHORT CUT ERROR')
    }
  },
  unicode: () => {
    const state = store.getState();
    store.dispatch({
      type: 'SET_UNICODE',
      payload: !state.unicode,
    });
  },
  centerAlign: () => {
    const state = store.getState();
    store.dispatch({
      type: 'SET_CENTER_ALIGN_OPTION',
      payload: !state.centerAlignGurbani,
    });
  },
  toggleEngTranslation: (e) => {
    e.preventDefault();
    const state = store.getState();
    store.dispatch({
      type: 'SET_TRANSLATION_LANGUAGES',
      payload: selectItemInArray('english', state.translationLanguages),
    });
  },
  togglePunjabiTranslation: (e) => {
    e.preventDefault();
    const state = store.getState();
    store.dispatch({
      type: 'SET_TRANSLATION_LANGUAGES',
      payload: selectItemInArray('punjabi', state.translationLanguages),
    });
  },
  toggleSpanishTranslation: (e) => {
    e.preventDefault();
    const state = store.getState();
    store.dispatch({
      type: 'SET_TRANSLATION_LANGUAGES',
      payload: selectItemInArray('spanish', state.translationLanguages),
    });
  },
  toggleEngTranslit: () => {
    const state = store.getState();
    store.dispatch({
      type: 'SET_TRANSLITERATION_LANGUAGES',
      payload: selectItemInArray('english', state.transliterationLanguages),
    });
  },
  toggleShahTranslit: () => {
    const state = store.getState();
    store.dispatch({
      type: 'SET_TRANSLITERATION_LANGUAGES',
      payload: selectItemInArray('shahmukhi', state.transliterationLanguages),
    });
  },
  toggleHinTranslit: () => {
    const state = store.getState();
    store.dispatch({
      type: 'SET_TRANSLITERATION_LANGUAGES',
      payload: selectItemInArray('hindi', state.transliterationLanguages),
    });
  },
  increaseFontSize: () => {
    const state = store.getState();
    store.dispatch({
      type: 'SET_FONT_SIZE',
      payload:
        state.fontSize < 3.2
          ? toFixedFloat(state.fontSize + 0.4)
          : toFixedFloat(state.fontSize),
    });
    store.dispatch({
      type: 'SET_TRANSLATION_FONT_SIZE',
      payload: Math.min(toFixedFloat(state.translationFontSize + 0.4), 2.4),
    });
    store.dispatch({
      type: 'SET_TRANSLITERATION_FONT_SIZE',
      payload: Math.min(toFixedFloat(state.transliterationFontSize + 0.4), 3.2),
    });
  },
  decreaseFontSize: () => {
    const state = store.getState();
    store.dispatch({
      type: 'SET_FONT_SIZE',
      payload:
        state.fontSize >= 1.6
          ? toFixedFloat(state.fontSize - 0.4)
          : toFixedFloat(state.fontSize),
    });
    store.dispatch({
      type: 'SET_TRANSLATION_FONT_SIZE',
      payload: Math.max(toFixedFloat(state.translationFontSize - 0.4), 1.2),
    });
    store.dispatch({
      type: 'SET_TRANSLITERATION_FONT_SIZE',
      payload: Math.max(toFixedFloat(state.transliterationFontSize - 0.4), 1.2),
    });
  },
};
// export default Shortcuts;
export {
  ViewerShortcutHanders,
  ViewerShortcuts,
  GlobalHandlers,
  GlobalShortcuts,
};
