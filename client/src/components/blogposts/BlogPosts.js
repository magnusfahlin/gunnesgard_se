import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BlogPost from './BlogPost';
import { connect } from 'react-redux'

class BlogPosts extends Component {
      constructor(props) {
          super(props);
      }

    render() {
        let blogPostItems;
        if (this.props.posts) {
            blogPostItems = this.props.posts.map(post =>
            <BlogPost
                title={post.title} 
                text={post.text}
                author={post.author}
                location={post.location}
                date={post.date ? post.date.toLocaleTimeString('sv-SE',  {year: 'numeric', month: 'short', day: 'numeric'}) : ""}
                showAddComment={this.props.showAddComment}/>
                );
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
        posts : state.posts.posts,
        showAddComment:  state.postViewer.showAddComment,
        showComments:  state.postViewer.showComments
    }
}

function mapDispatchToProps(dispatch) {
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogPosts);
