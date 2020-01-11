import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';
import {ApolloProvider} from '@apollo/react-hooks';

const cache = new InMemoryCache({dataIdFromObject: object => object.id});
const client = new ApolloClient({
    cache,
    link: new HttpLink({
        uri: 'http://localhost:4000/',
        headers: {
            'client-name': 'Recipe Scheduler [web]',
            'client-version': '1.0.0',
        },
    }),
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root'),
);
registerServiceWorker();
