import React, { Component } from 'react';
import '../styles/app.css';

import CalendarBox from './components/CalendarBox';
import Loading from './components/Loading';

export default class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      days: [],
      data: [],
      loading: false
    };

    this.currentDate = new Date();
    this.firstMonday = undefined;
  }

  async componentDidMount () {
    let days = [];
    for (let i = 1; i <= new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).getDate(); i++) {
      if (!this.firstMonday) {
        const d = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), i);
        d.setDate(d.getDate() + (1 + 7 - d.getDay()) % 7);
        this.firstMonday = d.getDate();
        const daysTilMonday = 8 - this.firstMonday;
        if (daysTilMonday < 7) {
          for (let x = 0; x < daysTilMonday; x++) {
            days = [...days, undefined];
          }
        }
      }

      days = [...days, new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), i)];
    }

    this.setState({
      days
    });

    const data = await (await fetch('/api/v1/shifts', {
      headers: {
        Authorization: 'Bearer ccdcd9e0844111b17da776a9d89ddd3017bbac731e898c7a'
      }
    })).json();

    if (data.success && data.data) {
      this.setState({
        data: data.data
      });
    }
  }

  onGenerate = async () => {
    this.setState({
      loading: true
    });

    await fetch('/api/v1/shifts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ccdcd9e0844111b17da776a9d89ddd3017bbac731e898c7a'
      },
      body: JSON.stringify([
        'Marianne Mcintyre',
        'Salim Browning',
        'Adyan Caldwell',
        'Marion Mathis',
        'Alfred Finley',
        'Lois Turner',
        'Georgina Rivas',
        'Kris Howells',
        'Isma Medrano',
        'Kaisha Mcnally'
      ])
    });

    const data = await (await fetch('/api/v1/shifts', {
      headers: {
        Authorization: 'Bearer ccdcd9e0844111b17da776a9d89ddd3017bbac731e898c7a'
      }
    })).json();

    this.setState({
      data: data.data || [],
      loading: false
    });
  }

  render () {
    return (
      <>
        <div className={['app-overlay', this.state.loading ? 'active' : ''].join(' ')}>
          <Loading />
        </div>
        <form className="app-buttons">
          <button type="button" onClick={this.onGenerate}>Generate</button>
        </form>
        <div className="app-header">
          <div className="app-hd-item">Monday</div>
          <div className="app-hd-item">Tuesday</div>
          <div className="app-hd-item">Wednesday</div>
          <div className="app-hd-item">Thursday</div>
          <div className="app-hd-item">Friday</div>
          <div className="app-hd-item">Saturday</div>
          <div className="app-hd-item">Sunday</div>
        </div>
        <div className="app">
          {this.state.days.map((x, i) => {
            if (!x) {
              return <CalendarBox key={`EMPT-${i}`} />;
            }

            const data = this.state.data.filter((y) => y.shifts.includes(`${x.getFullYear()}-${(x.getMonth() + 1).toString().padStart(2, '0')}-${(x.getDate()).toString().padStart(2, '0')}`));
            return <CalendarBox class={x.getDay() === 6 || x.getDay() === 0 ? ['weekend'] : ['']} engineers={data} day={x.getDate()} key={x.getDate()} />;
          })}
        </div>
      </>
    );
  }
}
