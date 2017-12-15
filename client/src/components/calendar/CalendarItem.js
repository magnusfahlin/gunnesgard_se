import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CalendarItem extends Component {
      constructor(props) {
          super(props);
      }

      render() {
                return (
                    <div className='calendarItem'>
                        <div className='red'>{this.props.title}</div>
                        <div className='text'>{this.props.date}</div>
                    </div>
                );
      }
}

CalendarItem.propTypes = {
    title: PropTypes.string,
    date: PropTypes.date
}

export default CalendarItem;