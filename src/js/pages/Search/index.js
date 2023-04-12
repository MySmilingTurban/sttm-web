/* globals API_URL */
import React from 'react';
import PropTypes from 'prop-types';
import { buildApiUrl } from '@sttm/banidb';
import { TEXTS } from '../../constants';
import PageLoader from '../PageLoader';
import GenericError, { SachKaur } from '../../components/GenericError';
import Layout, { Stub } from './Layout';
import { getShabadsFromChatbot } from '@/util';

export default class Search extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      shabadData: [],
      isLoaded: false
    }
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

  componentDidMount() {
    const { q, type, source, offset, writer } = this.props;
    if (type === 8) {
      getShabadsFromChatbot(q, {type, source, writer})
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              shabadData: result
            });
          },
          // error handler
          (error) => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        )
    }
  }

  render() {
    const { q, type, source, offset, writer } = this.props;
    const { error, isLoaded, shabadData } = this.state;

    if (q === '' || error !== null) {
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

    return (
      <PageLoader url={url}>
        {({ loading, data }) => {
          if (loading || data === undefined || (type === 8 ? !isLoaded : false)) return <Stub />;

          let {resultsInfo, verses} = data;

          if (type === 8) {
            const resData = shabadData;// async() => await getShabadsFromChatbot(q, {type, source, writer});
            resultsInfo = {
              pageResults: 10,
              pages: {
                page: 1,
                resultsPerPage: 20,
                totalPages: 1
              },
              totalResults: 10
            };
            verses = resData;//await Promise.resolve(resData);
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
