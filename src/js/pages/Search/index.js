/* globals API_URL */
import React from 'react';
import PropTypes from 'prop-types';
import { buildApiUrl } from '@sttm/banidb';
import { CHATBOT_API_URL, TEXTS } from '../../constants';
import PageLoader from '../PageLoader';
import GenericError, { SachKaur } from '../../components/GenericError';
import Layout, { Stub } from './Layout';
import { getShabadIDList, getShabadListURL, getShabadsFromShabadIDList } from '@/util';

export default class Search extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      idList: [],
    };
  }

  static defaultProps = {
    offset: 0,
  };

  static propTypes = {
    q: PropTypes.string.isRequired,
    type: PropTypes.number,
    source: PropTypes.string,
    offset: PropTypes.number,
    writer: PropTypes.string,
  };

  setIDList = () => {
    const { q, type } = this.props;
    if ( type === 8 ) {
      let shabadList = getShabadIDList(q);
      this.setState({ idList: shabadList });
    }
  }

  async componentDidMount() {
    const { q, type } = this.props;
    console.log("type: ", type);
    if ( type === 8 ) {
      const shabadList = await getShabadIDList(q);
      this.setIDList(shabadList);
    }
  }

  render() {
    const { q, type, source, offset, writer } = this.props;

    if (q === '') {
      return (
        <GenericError
          title={TEXTS.EMPTY_QUERY}
          description={TEXTS.EMPTY_QUERY_DESCRIPTION}
          image={SachKaur}
        />
      );
    }

    let url = encodeURI(
      buildApiUrl({ q, type, source, offset, writer, API_URL })
    );
    if (type === 8) {
      let resData = getShabadListURL(q);
      url = encodeURI(`${resData}`)
      console.log("resdata :", resData);
    }
    console.log(url, 'SEARCH RESULTS...');

    return (
      <PageLoader url={url}>
        {({ loading, data }) => {
          if (loading || data === undefined) return <Stub />;

          let resultsInfo = data.resultsInfo;
          let verses = data.verses;

          if (type === 8) {
            let idList = this.state.idList;
            let cData = getShabadsFromShabadIDList(idList)
            console.log('CHATBOT RESULTS...', cData);
            resultsInfo = cData.resultsInfo;
            verses = cData.verses; 
          }

          return (
            <Layout
              pages={Array.from(
                Array(parseInt(resultsInfo.pages.totalPages)),
                (_, i) => i + 1
              )}
              totalResults={resultsInfo.totalResults || 0}
              resultsCount={resultsInfo.pageResults || 0}
              offset={offset}
              //nextPageOffset={resultsInfo.pages.page}
              shabads={verses}
              q={q}
              type={type}
              source={source}
              writer={writer}
            />
          );
        }}
      </PageLoader>
    );
  }
}
