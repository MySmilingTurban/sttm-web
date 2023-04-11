import axios from 'axios';
import { buildApiUrl, SOURCES } from '@sttm/banidb';
import { API_URL, SEARCH_TYPES, CHATBOT_API_URL } from '@/constants';
import { toShabadURL } from '../url';
import { translationMap, transliterationMap, getGurmukhiVerse, getVerseId, getShabadId, getUnicodeVerse } from '../api/shabad';
import { getHighlightIndices } from '../gurbani';

export const getShabadIDList = async function (query: String) {
    // refine the query for url
    const url = encodeURI(`${CHATBOT_API_URL}search/?query=${query}&count=20`);
    // let res;
    // try {
    //     res = await axios.get(uri);
    // } catch (error) {
    //     console.log(error);
    // }
    // let idList = [];
    // if (res.status === 200) {
    //     console.log("resData: ", res);
    //     const { results } = res.data;
    //     for (const shabad of results) {
    //         idList.push(shabad.ID);
    //     }
    // }
    // return idList;
    return new Promise((resolve, reject) => {
        const json = fetch(url).then((response) => response.json());
        json.then(
          (data) => {
            let idList = [];
            const { results } = data;
            for (const shabad of results) {
                idList.push(shabad.ID);
            }
            // let idString = `https://api.banidb.com/shabads/${idList.join(',')}`;
            resolve(idList);
          },
          (error) => { 
            console.log(error);
            reject(error); });
      });
}

export const getShabadListURL =  async function (query:String) {
    const idList = await getShabadIDList(query);
    return `https://api.banidb.com/v2/shabads/${idList.join(",")}`;
}

export const getShabadsFromShabadIDList = (idList: Object[], q: string) => {
    const url = `https://api.banidb.com/v2/shabads/${idList.join(",")}`;
    return new Promise((resolve, reject) => {
        const json = fetch(url).then((response) => response.json());
        json.then(
        (data) => {
            const { shabads } = data;
            const type = SEARCH_TYPES.ASK_A_QUESTION;
            const source = SOURCES.all;
            
            let panktiList = [];
            for (const shabad of shabads) {
                const shabadId = shabad.shabadInfo.shabadId;
                const verseId = getVerseId(shabad.verses[0]);
                let highlightPankti = getGurmukhiVerse(shabad.verses[0]);
                if (type === 3) {
                highlightPankti = translationMap["english"](shabad.verses[0]);
                }
    
                const highlightIndex = getHighlightIndices(
                    highlightPankti,
                    q,
                    SEARCH_TYPES.FIRST_LETTERS
                );
                
                panktiList.push({
                    pankti: getGurmukhiVerse(shabad.verses[0]),
                    translation: translationMap["english"](shabad),
                    query: q,
                    url: toShabadURL({ shabad : { shabadId, verseId }, q, type, source }),
                    highlightIndex,
                    shabadId: shabadId,
                });
            }
            resolve(panktiList);
        },
        (error) => { 
            console.log(error);
            reject(error); }
        );
    });
    
}

export const getShabadListForChatbot = (q) => {
  let query = q.replace(' ', '%20');
  const url = `https://semanticgurbanisearch.sevaa.win/search/?query=${query}&count=5`;
  return new Promise((resolve, reject) => {
    const json = fetch(url).then((response) => response.json());
    json.then(
        (data) => {
            const { results } = data;
            let panktiList = [];
            for (const shabad of results) {
                panktiList.push({
                    url: shabad.url,
                    shabadId: shabad.shabadId,
                })
                console.log('Shabad ID: ',shabad.shabadId);
            }
            resolve(panktiList);
        }
    )
    //   (data) => {
    //     const { verses } = data;
    //     let panktiList = [];
    //     for (const shabad of verses) {
    //       let highlightPankti = getGurmukhiVerse(shabad);
    //       if (type === 3) {
    //         highlightPankti = translationMap["english"](shabad);
    //       }

    //       if (isSearchTypeRomanizedFirstLetters) {
    //         highlightPankti = transliterationMap["english"](shabad);
    //       }

    //       const highlightIndex = getHighlightIndices(
    //         highlightPankti,
    //         q,
    //         type
    //       );

    //       panktiList.push({
    //         pankti: getGurmukhiVerse(shabad),
    //         translation: translationMap["english"](shabad),
    //         query: q,
    //         url: toShabadURL({ shabad, q, type, source }),
    //         highlightIndex,
    //         verseId: getVerseId(shabad),
    //         shabadId: getShabadId(shabad),
    //         verse: getUnicodeVerse(shabad)
    //       })
    //     }
    //     resolve(panktiList);
    //   },
    //   (error) => { reject(error); });
  });
} 

