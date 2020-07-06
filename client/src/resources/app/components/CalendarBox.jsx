import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class CalendarBox extends Component {
  static propTypes = {
    day: PropTypes.number,
    engineers: PropTypes.array,
    class: PropTypes.array
  }

  render () {
    if (!this.props.engineers || !this.props.day) {
      return (
        <div className="cald-box empty"></div>
      );
    }

    return (
      <div className={['cald-box', ...this.props.class].join(' ')}>
        <div className="cald-box-title">{this.props.day}</div>
        {this.props.engineers.map((engineer, i) => {
          return <div className="cald-box-line" key={i}>{engineer.name}</div>;
        })}
      </div>
    );
  }
}
