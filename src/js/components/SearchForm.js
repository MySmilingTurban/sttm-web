import React from 'react';
import PropTypes from 'prop-types';

import {
  TYPES,
  SOURCES,
  LOCAL_STORAGE_KEY_FOR_SEARCH_SOURCE,
  LOCAL_STORAGE_KEY_FOR_SEARCH_TYPE,
  LOCAL_STORAGE_KEY_FOR_SEARCH_WRITER,
  PLACEHOLDERS,
  DEFAULT_SEARCH_TYPE,
  DEFAULT_SEARCH_SOURCE,
  SEARCH_TYPES,
  SEARCH_TYPES_NOT_ALLOWED_KEYS,
  SOURCES_WITH_ANG,
  DEFAULT_SEARCH_WRITER,
  DEFAULT_SEARCH_WRITERS,
} from '@/constants';
import { getNumberFromLocalStorage, clickEvent, ACTIONS, getWriterList } from '@/util';

/**
 *
 *
 * @export
 * @class SearchForm
 * @augments {React.PureComponent<SearchFormProps>}
 */
export default class SearchForm extends React.PureComponent {
  static defaultProps = {
    defaultQuery: '',
    submitOnChangeOf: [],
  };

  /**
   * @typedef {object} SearchFormRenderProps
   * @property {string} pattern attribute of input field
   * @property {string} title of input field
   * @property {string} className className of input field
   * @property {string} action of form
   * @property {string} name of input field
   * @property {string} inputType Search type chosen by used
   * @property {function} setGurmukhiKeyboardVisibilityAs
   * @property {function} setQueryAs
   * @property {function} handleSearchChange
   * @property {function} handleSearchSourceChange
   * @property {function} handleSearchTypeChange
   * @property {function} handleSearchWriterChange
   * @property {function} handleReset
   * @property {function} handleSubmit
   *
   * @typedef {object} SearchFormProps
   * @property {SearchFormRenderProps => React.Element} children as a function
   * @property {string} defaultQuery to initialize with
   * @property {number} defaultType to initialize with
   * @property {string} defaultSource to initiaize with
   * @property {number} defaultWriter to intilaize with
   * @property {Array<'type'|'source'|'query'|'writer'>} submitOnChangeOf given fields
   * @property {function} onSubmit event handler
   *
   * @static
   * @memberof SearchForm
   */
  static propTypes = {
    children: PropTypes.func.isRequired,
    defaultQuery: PropTypes.string,
    defaultType: PropTypes.oneOf(Object.keys(TYPES).map(type => parseInt(type))),
    defaultSource: PropTypes.oneOf(Object.keys(SOURCES)),
    defaultWriter: PropTypes.number,
    submitOnChangeOf: PropTypes.arrayOf(
      PropTypes.oneOf(['type', 'source', 'query', 'writer'])
    ),
    onSubmit: props => {
      if (
        props.submitOnChangeOf.length !== 0 &&
        typeof props.onSubmit !== 'function'
      ) {
        return new Error(
          `"onSubmit" is required when "submitOnChange" isn't empty`
        );
      }
    },
  };


  state = {
    displayGurmukhiKeyboard: false,
    query: this.props.defaultQuery,
    shouldSubmit: false,
    type:
      this.props.defaultType ||
      getNumberFromLocalStorage(
        LOCAL_STORAGE_KEY_FOR_SEARCH_TYPE,
        DEFAULT_SEARCH_TYPE
      ),
    source:
      this.props.defaultSource ||
      localStorage.getItem(LOCAL_STORAGE_KEY_FOR_SEARCH_SOURCE) ||
      DEFAULT_SEARCH_SOURCE,
    writer:
      this.props.defaultWriter || 
      localStorage.getItem(LOCAL_STORAGE_KEY_FOR_SEARCH_WRITER) ||
      DEFAULT_SEARCH_WRITER,
    writers: DEFAULT_SEARCH_WRITERS,
    isSourceChanged: false,
    isWriterChanged: false,
    placeholder: '',
    isAnimatingPlaceholder: false,
  };

  animatePlaceholder = () => {
    const [finalPlaceholder] = PLACEHOLDERS[this.state.type];
    const millisecondPerLetter = 2000 / finalPlaceholder.length;
    const tick = () => {
      this.timer = setTimeout(
        () => this._setState(({ isAnimatingPlaceholder, placeholder }) => {
          if (!isAnimatingPlaceholder) return null;

          if (placeholder === finalPlaceholder) {
            return { isAnimatingPlaceholder: false };
          }
          else if (finalPlaceholder[placeholder.length]) {
            return {
              placeholder:
                placeholder + finalPlaceholder[placeholder.length],
            };
          }
        },
          () => this.state.isAnimatingPlaceholder && tick()
        ),
        millisecondPerLetter
      )
    };

    tick();
  };

  beginPlaceholderAnimation = () => {
    if (this.state.query === '') {
      clearTimeout(this.timer);
      this._setState({ isAnimatingPlaceholder: true, placeholder: '' }, () => {
        requestAnimationFrame(this.animatePlaceholder);
      });
    }
  };

  stopPlaceholderAnimation = () =>
    new Promise(resolve =>
      this.setState({ isAnimatingPlaceholder: false }, () => {
        clearTimeout(this.timer);
        resolve();
      })
    );

  fetchWriters = () => {
    getWriterList()
      .then(writersData => {
        this._setState({ writers: writersData })
      })    
  }

  selectHighlight = () => {
    this._setState({
      isSourceChanged: this.state.source !== DEFAULT_SEARCH_SOURCE,
      isWriterChanged: this.state.writer !== DEFAULT_SEARCH_WRITER
    })
  }

  _setState = (...args) => (this._mounted ? this.setState(...args) : null);

  componentDidMount() {
    this._mounted = true;
    this.beginPlaceholderAnimation();
    this.fetchWriters();
    this.selectHighlight();
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  _isShowKeyboard(type) {
    const searchType = type || this.state.type;

    return (
      searchType === SEARCH_TYPES.MAIN_LETTERS ||
      searchType === SEARCH_TYPES.GURMUKHI_WORD ||
      searchType === SEARCH_TYPES.FIRST_LETTERS ||
      searchType === SEARCH_TYPES.FIRST_LETTERS_ANYWHERE
    );
  }

  render() {
    const {
      state,
      setQueryAs,
      setGurmukhiKeyboardVisibilityAs,
      handleSearchChange,
      handleSearchSourceChange,
      handleSearchTypeChange,
      handleSearchWriterChange,
      handleSubmit,
      handleKeyDown,
      handleReset,
    } = this;

    const { type, query } = this.state;
    const typeInt = parseInt(type);
    const [, useEnglish = false] = PLACEHOLDERS[type];
    const className = useEnglish ? '' : 'gurbani-font';
    const isShowKeyboard = this._isShowKeyboard();
    const [title, pattern] =
      typeInt === SEARCH_TYPES.ROMANIZED
        ? ['Enter 4 words minimum.', '(\\w+\\W+){3,}\\w+\\W*']
        : typeInt === SEARCH_TYPES.ANG
          ? ['Enter numbers only.', '\\d+']
          : ['Enter 2 characters minimum.', '.{2,}'];

    const [action, name, inputType] = SearchForm.getFormDetails(
      typeInt
    );
    const disabled = !new RegExp(pattern).test(query);


    return this.props.children({
      ...state,
      isShowKeyboard,
      pattern,
      disabled,
      title,
      className,
      action,
      name,
      inputType,
      setQueryAs,
      setGurmukhiKeyboardVisibilityAs,
      handleSearchChange,
      handleSearchSourceChange,
      handleSearchTypeChange,
      handleSearchWriterChange,
      handleSubmit,
      handleKeyDown,
      handleReset,
    });

  }
  componentDidUpdate() {
    const {
      state: { shouldSubmit, source, type, query, writer },
      props: { onSubmit },
    } = this;

    if (shouldSubmit) {
      this.setState(
        {
          shouldSubmit: false,
        },
        () => {
          this.handleSubmit();
          onSubmit({
            source,
            type,
            query,
            writer
          });
        }
      );
    }
  }

  isQueryAllowed = (query, type = this.state.type) => {
    // Different search types have different criteria to tell
    // if it's allowed to be entered or not
    if (query) {
      switch (type) {
        case SEARCH_TYPES.MAIN_LETTERS:
        case SEARCH_TYPES.ROMANIZED_FIRST_LETTERS_ANYWHERE: {
          const notAllowedKeys = SEARCH_TYPES_NOT_ALLOWED_KEYS[type];
          if (notAllowedKeys.length > 0) {
            const notAllowedKeysRegex = new RegExp(notAllowedKeys.join('|'));

            // if it's not allowed key, then return false
            if (notAllowedKeysRegex.test(query)) {
              return false;
            }
          }
        }
          break;
      }
    }
    return true;
  }

  // Retuns a function
  setGurmukhiKeyboardVisibilityAs = value => () => {
    if (value !== this.state.displayGurmukhiKeyboard) {
      this.setState({ displayGurmukhiKeyboard: value }, () => {
        clickEvent({
          action: ACTIONS.GURMUKHI_KEYBOARD,
          label: value ? 1 : 0,
        });
      });
    }
  }

  setQueryAs = value => () => {
    return this.stopPlaceholderAnimation().then(() => {
      return this.setState(() => ({
        query: value,
        shouldSubmit:
          this.props.submitOnChangeOf.includes('query') && value !== '',
      }))
    })
  }

  handleKeyDown = (e) => {
    const { type } = this.state;
    switch (type) {
      case SEARCH_TYPES.MAIN_LETTERS:
      case SEARCH_TYPES.ROMANIZED_FIRST_LETTERS_ANYWHERE: {
        const notAllowedKeys = SEARCH_TYPES_NOT_ALLOWED_KEYS[type];
        if (notAllowedKeys.length > 0) {
          const isPressedKeyNotAllowed = notAllowedKeys.some((key) => key === e.key);
          // if it's not allowed key, then return false
          if (isPressedKeyNotAllowed) {
            e.preventDefault();
            return false;
          }
        }
      }
        break;
    }

    return true;
  }
  handleSearchChange = ({ target }) => {
    const query = target.value;
    if (this.isQueryAllowed(query)) {
      const cursorStart = target.selectionStart;
      const cursorEnd = target.selectionEnd;
      this.setQueryAs(query)().then(() => {
        if (cursorStart !== null) {
          return target.setSelectionRange(cursorStart, cursorEnd)
        }
      });
    }
  };

  handleSearchSourceChange = ({target}) => {
    const source = target.value
    this.setState(
      {
        source,
        shouldSubmit:
          this.props.submitOnChangeOf.includes('source') &&
          this.state.query !== '',
        isSourceChanged: source !== DEFAULT_SEARCH_SOURCE
      },
      () => {
        clickEvent({
          action: ACTIONS.SEARCH_SOURCE,
          label: this.state.source,
        });
        localStorage.setItem(
          LOCAL_STORAGE_KEY_FOR_SEARCH_SOURCE,
          this.state.source
        );        
      }
    );
  }

  handleSearchTypeChange = ({ currentTarget: { value } }) => {
    const { type: currentSearchType, query, source, displayGurmukhiKeyboard } = this.state;
    const newSearchType = Number(value);
    let newSourceType = source;
    const isSearchTypeToAngSearchType = currentSearchType !== SEARCH_TYPES.ANG && newSearchType === SEARCH_TYPES.ANG;
    const isSearchTypeToAskAQuestion = currentSearchType !== SEARCH_TYPES.ASK_A_QUESTION && newSearchType === SEARCH_TYPES.ASK_A_QUESTION;
    const isSearchTypeToMainLetterSearchType = currentSearchType !== SEARCH_TYPES.MAIN_LETTERS && newSearchType === SEARCH_TYPES.MAIN_LETTERS;
    const isQueryToBeCleared = isSearchTypeToAskAQuestion || isSearchTypeToAngSearchType || (isSearchTypeToMainLetterSearchType && !this.isQueryAllowed(query, newSearchType));

    // We are only showing keyboard :
    // If they falls in the gurmukhi keyboard category && keyboard is already open/active.
    // If keyboard is closed already, no need to set it as active.
    const isShowKeyboard = this._isShowKeyboard(newSearchType) && displayGurmukhiKeyboard;

    if (isSearchTypeToAngSearchType) {
      newSourceType = Object.keys(SOURCES_WITH_ANG).includes(newSourceType) ? newSourceType : 'G'
    }

    this.stopPlaceholderAnimation().then(() =>
      this.setState(
        {
          type: newSearchType,
          source: newSourceType,
          query: isQueryToBeCleared ? '' : query,
          shouldSubmit: (isSearchTypeToAngSearchType || isSearchTypeToAskAQuestion) ? false :
            this.props.submitOnChangeOf.includes('type') &&
            this.state.query !== '',
          displayGurmukhiKeyboard: isShowKeyboard,
        },
        () => {
          clickEvent({ action: ACTIONS.SEARCH_TYPE, label: newSearchType });
          localStorage.setItem(
            LOCAL_STORAGE_KEY_FOR_SEARCH_TYPE,
            newSearchType
          );
          localStorage.setItem(
            LOCAL_STORAGE_KEY_FOR_SEARCH_SOURCE,
            newSourceType
          );
          requestAnimationFrame(this.beginPlaceholderAnimation);
        }
      )
    );
  }

  handleSearchWriterChange = ({target}) => {
    const writer = target.value
    this.setState({
      writer,
      shouldSubmit:
        this.props.submitOnChangeOf.includes('writer') &&
        this.state.query !== '',
      isWriterChanged: writer !== DEFAULT_SEARCH_WRITER
    },
    () => {
      clickEvent({
        action: ACTIONS.SEARCH_WRITER,
        label: this.state.writer,
      });
      localStorage.setItem(
        LOCAL_STORAGE_KEY_FOR_SEARCH_WRITER,
        this.state.writer
      );
    })
  }

  handleReset = (e) => {
    e.preventDefault();
    const { type } = this.state;
    this.setState({
      source: type === SEARCH_TYPES.ANG ? 'G' : DEFAULT_SEARCH_SOURCE, // For Ang type: default to G
      writer: DEFAULT_SEARCH_WRITER,
      isSourceChanged: false,
      isWriterChanged: false,
      shouldSubmit:
        this.props.submitOnChangeOf.includes('source') &&
        this.props.submitOnChangeOf.includes('writer') &&
        this.state.query !== ''
    },
    () => {
      localStorage.setItem(LOCAL_STORAGE_KEY_FOR_SEARCH_SOURCE, this.state.source);
      localStorage.removeItem(LOCAL_STORAGE_KEY_FOR_SEARCH_WRITER);
    })
  }

  handleSubmit = () => {
    /* Possible Validations, Analytics */
    clickEvent({
      action: ACTIONS.SEARCH_QUERY,
      label: this.state.query,
    });
  };

  /**
   * Returns an array of form action, input name and input type
   * @param {number} type
   * @memberof SearchForm
   */
  static getFormDetails = type =>
    type === SEARCH_TYPES.ANG
      ? ['/ang', 'ang', 'number']
      : ['/search', 'q', 'search'];
}
