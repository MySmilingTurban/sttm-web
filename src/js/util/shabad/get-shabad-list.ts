import { buildApiUrl } from '@sttm/banidb';
import { SEARCH_TYPES } from '@/constants';
import { toShabadURL } from '../url';
import { translationMap, transliterationMap, getGurmukhiVerse, getVerseId, getShabadId, getUnicodeVerse } from '../api/shabad';
import { getHighlightIndices } from '../gurbani';

export const getShabadList = (q, { type, source, writer }) => {
  const offset = 1;
  const isSearchTypeRomanizedFirstLetters = type === SEARCH_TYPES.ROMANIZED_FIRST_LETTERS_ANYWHERE;
  const isSearchAskaQuestion = type === SEARCH_TYPES.ASK_A_QUESTION;
  const livesearch = !isSearchTypeRomanizedFirstLetters;
  const url = ( isSearchAskaQuestion ? encodeURI(`https://semanticgurbanisearch.sevaa.win/search/?query=${q}&count=5`).replace(/%20/g, '%') : encodeURI(buildApiUrl({ q, type, source, writer, offset, API_URL, livesearch })));
  return new Promise((resolve, reject) => {
    const json = fetch(url).then((response) => response.json());
    json.then(
      (data) => {
        let panktiList = [];
        if (isSearchAskaQuestion) {
          const { results } = data;
          for (const shabad of results) {
            panktiList.push({
              shabadId: shabad.ID,
            })
          }
        } else {

          const { verses } = data;
          for (const shabad of verses) {
            let highlightPankti = getGurmukhiVerse(shabad);
            if (type === 3) {
              highlightPankti = translationMap["english"](shabad);
            }
  
            if (isSearchTypeRomanizedFirstLetters) {
              highlightPankti = transliterationMap["english"](shabad);
            }
  
            const highlightIndex = getHighlightIndices(
              highlightPankti,
              q,
              type
            );
  
            panktiList.push({
              pankti: getGurmukhiVerse(shabad),
              translation: translationMap["english"](shabad),
              query: q,
              url: toShabadURL({ shabad, q, type, source }),
              highlightIndex,
              verseId: getVerseId(shabad),
              shabadId: getShabadId(shabad),
              verse: getUnicodeVerse(shabad)
            })
          }
        }
        resolve(panktiList);
      },
      (error) => { 
        console.log(error);
        reject(error); });
  });
}
