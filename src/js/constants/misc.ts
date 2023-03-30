import { SOURCES, SOURCES_WITH_ANG } from '@sttm/banidb';
import { SEARCH_TYPES } from './search-types';

export { SOURCES, SOURCES_WITH_ANG };

const _TYPES = [
  "First letter each word from start (Gurmukhi)",
  "First letter each word anywhere (Gurmukhi)",
  "Full Word (Gurmukhi)",
  "Full Word Translation (English)",
  "Romanized Gurmukhi (English)",
  "Ang",
  "Main Letters (Gurmukhi)",
  "Romanized first letter anywhere (English)",
  "Ask a Question"
]

export const BANI_LENGTH_COLS = {
  short: 'existsSGPC',
  medium: 'existsMedium',
  long: 'existsTaksal',
  extralong: 'existsBuddhaDal',
};

export const TYPES = _TYPES.filter((value, index) =>
  Object.values(SEARCH_TYPES).includes(index));

export const SHORT_DOMAIN = 'sttm.co';
export const MAHANKOSH_TOOLTIP_SOURCE = 'Source: Mahaan Kosh (Encyclopedia)';
export const HUKAMNAMA_AUDIO_URL='http://old.sgpc.net/hukumnama/jpeg%20hukamnama/hukamnama.mp3';
export const S3_BUCKET_URL = 'https://sikhifm-audio.s3.us-west-1.amazonaws.com/';
export const API_URL = "https://sttm-fm.thedev.studio/v1/";
export const CHATBOT_API_URL = "https://semanticgurbanisearch.sevaa.win/"