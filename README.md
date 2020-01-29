# Recipe Scheduler

This project allows users to save food recipes to a database. Users can store the dates of when they made the recipes and create notes.

![Screenshot 1](/client/src/static/images/landingPageImage1.png?raw=true 'Screenshot 1')

![Screenshot 2](/client/src/static/images/landingPageImage3.png?raw=true 'Screenshot 2')

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need to create a Firebase Application at https://firebase.google.com/
Copy the firebase credientials stored as a json into the repository

### Installing

Install the dependencies of the backend server where the API calls are made.

```
npm install
```

Next, install the dependencies of the client.

```
cd client && npm install
```

To run the React server on port 3000

```
npm run client
```

To run the backend REST server on port 5000

```
npm run restServer
```

To run the GraphQL server on port 4000

```
npm run graphQLServer
```

To run the client, REST, and GraphQL server concurrently

```
npm run dev
```

## Built With

-   [React](https://reactjs.org/)
-   [Firebase](https://firebase.google.com/)
-   [GraphQL](https://graphql.org/)
-   [Apollo](https://www.apollographql.com/)
-   [Reactstrap](https://reactstrap.github.io/)
-   [Cheerio](https://cheerio.js.org/)

## Authors

-   **Zach DeLuna** - _Initial work_ - (https://github.com/zdeluna)
