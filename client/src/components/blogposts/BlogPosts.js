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
        if (this.props.BlogPosts && this.props.BlogPosts.length > 0) {
            blogPostItems = this.props.BlogPosts.map(post =>
            <BlogPost
                title={post.title} 
                text={post.text}
                author={post.author}
                location={post.location}
                date={post.date}
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



BlogPosts.propTypes = {
    blogPosts: PropTypes.array
}

function mapStateToProps(state) {   
    return {
        showAddComment:  state.blogpost.showAddComment,
        showComments:  state.blogpost.showComments
    }
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogPosts);
