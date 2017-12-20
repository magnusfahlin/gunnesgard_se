import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BlogPost from './BlogPost';
import Spinner from './../spinner/Spinner';
import ErrorMessage from './../errorMessage/ErrorMessage';
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";
import * as postActions from "../../actioncreators/posts.js";
import { POSTS_CREATE_POST, POSTS_FETCH_REQUEST, POSTS_FETCH_SUCCESS, POSTS_FETCH_FAILURE } from "../../actionTypes";

class BlogPosts extends Component {
      constructor(props) {
          super(props);
      }

      componentWillMount()
      {
          this.props.actions.fetchPosts();
      }
    render() {
        let blogPostItems;
        
        if (this.props.type ==  POSTS_FETCH_SUCCESS && this.props.posts) {
            blogPostItems = this.props.posts.map(post =>
            <BlogPost
                title={post.title} 
                text={post.text}
                author={post.author}
                location={post.location}
                date={post.date}// ? post.date.toLocaleTimeString('sv-SE',  {year: 'numeric', month: 'short', day: 'numeric'}) : ""}
                showAddComment={this.props.showAddComment}/>
                );
        } else if (this.props.type ==  POSTS_FETCH_REQUEST) {
            blogPostItems = <Spinner/>;
        } else {
             blogPostItems = <ErrorMessage message="Kunde inte ladda bloggen"/>;
        }

        return (
            <div className="blogPosts">
                {blogPostItems}
            </div>            
        );
    }
}

function mapStateToProps(state) { 

    return {
        type : state.posts.type,
        posts : state.posts.posts,
        showAddComment:  state.postViewer.showAddComment,
        showComments:  state.postViewer.showComments
    }
}

function mapDispatchToProps(dispatch) {
      return { actions: bindActionCreators(postActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogPosts);
