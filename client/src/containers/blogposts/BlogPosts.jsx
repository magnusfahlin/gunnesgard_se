import React, { Component } from 'react';

class BlogPosts extends Component {
      constructor(props) {
          super(props);
      }

    render() {
        let blogPostItems;
        if (this.props.blogPosts && this.props.blogPosts.length > 0) {
            blogPostItems = this.props.blogPosts.map(post => {
                //  console.log(post);
                return (
                    <div className='mainEntry'>
                        <div className='rubr'>{post.title}</div>
                        <div className='text'>{post.text}</div>
                        <div className='author'>av {post.author}, {post.location}  {post.date}</div>
                    </div>
                );
            }
            );
        }
        return (
            <div className="mainp">
                <h1>Posts </h1>
                {blogPostItems}
            </div>
        );
    }
}

BlogPosts.propTypes = {
    blogPosts: React.PropTypes.array
}

export default BlogPosts;