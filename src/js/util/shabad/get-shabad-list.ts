import { buildApiUrl } from '@sttm/banidb';
import { SEARCH_TYPES } from '@/constants';
import { SOURCES } from '@sttm/banidb';

import { toShabadURL } from '../url';
import { translationMap, transliterationMap, getGurmukhiVerse, getVerseId, getShabadId, getUnicodeVerse } from '../api/shabad';
import { getHighlightIndices } from '../gurbani';

const getShabads = async function (idList, q) {
  const url = encodeURI(`https://api.banidb.com/v2/shabads/${idList.join(",")}`);
  console.log("URL :", url);
  return new Promise((resolve, reject) => {
    const json = fetch(url).then((response) => response.json());
    json.then(
      (data) => {
        let panktiList = [];
        const { shabads } = data;
        for (const shabad of shabads) {
          const { source, writer, raag, shabadId } = shabad.shabadInfo;
          const type = SEARCH_TYPES.ASK_A_QUESTION;
          const verse = shabad.verses[0];
          let pack = {
            ...verse,
            writer,
            source,
            raag
          }

          let highlightPankti = getGurmukhiVerse(verse);
          if (type === 3) {
            highlightPankti = translationMap["english"](verse);
          }

          const highlightIndex = getHighlightIndices(
            highlightPankti,
            q,
            type
          );

          const ids = {
            shabadId,
            verseId: getVerseId(verse)
          };

          panktiList.push({
            pankti: getGurmukhiVerse(verse),
            translation: translationMap["english"](verse),
            query: q,
            url: toShabadURL({ shabad: pack, q, type, source }),
            highlightIndex,
            verseId: getVerseId(verse),
            shabadId: shabadId,
            verse: getUnicodeVerse(verse),
            ...pack
          })
        }
        resolve(panktiList);
      },
      (error) => { 
        console.log(error);
        reject(error); });
  });
}

// const getShabad = async function (idList, q) {
//   const url = encodeURI(`https://api.banidb.com/v2/shabads/${idList.join(",")}`);
//   return new Promise((resolve, reject) => {
//     const json = fetch(url).then((response) => response.json());
//     json.then(
//       (data) => {
//           const { shabads } = data;
//           const type = SEARCH_TYPES.ASK_A_QUESTION;
//           const source = SOURCES.all;
          
//           let panktiList = [];
//           for (const shabad of shabads) {
//               const shabadId = shabad.shabadInfo.shabadId;
//               const verseId = getVerseId(shabad.verses[0]);
//               let highlightPankti = getGurmukhiVerse(shabad.verses[0]);
  
//               const highlightIndex = getHighlightIndices(
//                   highlightPankti,
//                   q,
//                   SEARCH_TYPES.FIRST_LETTERS
//               );

//               let pack = {
//                 pankti: getGurmukhiVerse(shabad.verses[0]),
//                 translation: translationMap["english"](shabad.verses[0]),
//                 query: q,
//                 url: toShabadURL({ shabad : { shabadId, verseId }, q, type }),
//                 highlightIndex,
//                 shabadId: shabadId,
//               };
//               console.log(pack)
              
//               panktiList.push(pack);
//           }
//           resolve(panktiList);
//       },
//       (error) => { 
//         console.log(error);
//         reject(error); });
//   });
// }

export const getShabadList = async function (q, { type, source, writer }) {
  const offset = 1;
  const isSearchTypeRomanizedFirstLetters = type === SEARCH_TYPES.ROMANIZED_FIRST_LETTERS_ANYWHERE;
  const isSearchAskaQuestion = type === SEARCH_TYPES.ASK_A_QUESTION;
  const livesearch = !isSearchTypeRomanizedFirstLetters;
  const url = ( isSearchAskaQuestion ? encodeURI(`https://semanticgurbanisearch.sevaa.win/search/?query=${q}&count=10`) : encodeURI(buildApiUrl({ q, type, source, writer, offset, API_URL, livesearch })));
  // console.log("URL :", url);
  return new Promise((resolve, reject) => {
    const json = fetch(url).then((response) => response.json());
    json.then(
      (data) => {
        let panktiList = [];
        if (isSearchAskaQuestion) {
          const { results } = data;
          panktiList = results.map((ele, idx) => ele.ID);
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

export const getShabadsFromChatbot = async function (q, { type, source, writer }) {
  const idList = await getShabadList(q, { type, source, writer });
  const shabads = await getShabads(idList, q);
  return shabads;
}