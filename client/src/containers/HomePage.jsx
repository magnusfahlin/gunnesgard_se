/*import React from 'react';
import { Card, CardTitle } from 'material-ui/Card';


const HomePage = () => (
  <Card className="container">
    <CardTitle title="React Application" subtitle="This is the home page." />
  </Card>
);

export default HomePage;*/
import React, { PropTypes } from 'react';
import Auth from '../modules/Auth';
import LoginForm from '../components/LoginForm.jsx';
import BlogPosts from './blogposts/BlogPosts.jsx';
var axios = require('axios');


class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { blogPosts: [] };
  }

  componentDidMount() {
    var _this = this;
    this.serverRequest =
      axios
        .get("http://localhost:3000/api/blogposts")
        .then(function (result) {
          _this.setState({
            blogPosts: result.data
          });
        })
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  render() {
    var _this = this;
    return (
      <div className="App">
        <div className="App-header">
          {/*<img src={logo} className="App-logo" alt="logo" />*/}
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <BlogPosts
          blogPosts={
            _this.state.blogPosts
          }
        />
      </div>
    );
  }
}

export default HomePage;