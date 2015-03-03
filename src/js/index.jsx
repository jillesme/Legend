let CONFIG = {
  endpoint: 'http://localhost:3000/api/'
};

let Legend = React.createClass({
  getInitialState () {
    return {
      legend: '..',
      previous: '..',
      since: ''
    }
  },
  updateLegend (result) {
    this.setState(result);
  },
  componentWillMount () {
    superagent.get(CONFIG.endpoint).end((error, res) => {
      if (!error) {
        let response = JSON.parse(res.text);
        this.setState(response);
        // Set the title to the current legend
        document.title = response.legend || document.title;
      }
    });
  },
  render () {
    let newLegend;
    if (this.state.userAuthenticated) {
      newLegend = (
      <NewLegend
        currentLegend={this.state.legend}
        update={this.updateLegend} /> );
    }
    return (
      <div>
        <h1>Current Legend {this.state.legend}</h1>
        <p>Since {this.state.since} </p>
        <h2>Previous legend <strike>{this.state.previous}</strike></h2>

        <Auth loggedIn={this.state.userAuthenticated} />

        {newLegend}
      </div>
    )
  }
});

let Auth = React.createClass({
  render () {
    let partial;
    if (this.props.loggedIn) {
      partial = (<a href="/logout">Logout</a>);
    } else {
      partial = (<a href="/verify">Authenticate</a>);
    }
    return (
      <div>
        {partial}
      </div>
    );
  }
});

let NewLegend = React.createClass({
  setLegend () {
    let legend = this.refs.newlegend.getDOMNode().value;

    if (!/^[a-z\s]{3,18}$/gi.test(legend)) {
      alert(`Invalid legend "${legend}" `);
      return;
    }

    superagent.post(CONFIG.endpoint).send({
      newLegend: legend
    }).end((error, res) => {
      if (!error) {
        let response = JSON.parse(res.text);
        if (response.error) {
          alert(response.error);
        } else {
          this.props.update(response);
        }
      }
    });

  },
  render () {
    return (
      <div>
        <p>New Legend: </p>
        <input type="text" placeholder={this.props.currentLegend} ref="newlegend" />
        <button onClick={this.setLegend}>Save</button>
      </div>
    )
  }
});

React.render(<Legend />, document.body);
