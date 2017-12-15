import React, { Component } from 'react';
import PropTypes from 'prop-types';

class BlogPost extends Component {
      constructor(props) {
          super(props);
      }

      render() {
                let showAddComment;
                if (this.props.showAddComment)
                {
                    showAddComment = <div>Kommentera</div>;
                }
                return (
                    <div className='blogPost'>
                        <div className='title'>{this.props.title}</div>
                        <div className='text'>{this.props.text}</div>
                        <div className='author'>av {this.props.author}, {this.props.location}  {this.props.date}</div>
                        {showAddComment}
                    <hr/>
                    </div>
                );
      }
}

BlogPost.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
    author: PropTypes.string,
    location: PropTypes.location,
    date: PropTypes.date,
    showAddComment: PropTypes.bool
}

export default BlogPost;