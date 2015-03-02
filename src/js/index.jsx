let CONFIG = {
  endpoint: 'http://localhost:3000'
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
        this.setState(JSON.parse(res.text));
      }
    });
  },
  render () {
    return (
      <div>
        <h1>Current Legend {this.state.legend}</h1>
        <p>Since {this.state.since} </p>
        <h2>Previous legend <strike>{this.state.previous}</strike></h2>

        <NewLegend
          currentLegend={this.state.legend}
          update={this.updateLegend} />
      </div>
    )
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
        this.props.update(response);
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
