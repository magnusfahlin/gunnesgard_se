import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CalendarItem from './CalendarItem';

class Calendar extends Component {
      constructor(props) {
          super(props);
      }

    render() {
        let calendarItems;
        if (this.props.Calendar && this.props.Calendar.length > 0) {
            calendarItems = this.props.Calendar.map(item =>
            <CalendarItem
                title={item.title}
                date={item.date}/>
                );
        }
        return (
            <div className="calendar">
                <div className="title">Kalender</div>
                {calendarItems}
            </div>
        );
    }
}

Calendar.propTypes = {
    Calendar: PropTypes.array
}

export default Calendar;