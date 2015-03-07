import User from './user.jsx';
import Auth from './auth.jsx';
import NewLegend from './newlegend.jsx';

let Legend = React.createClass({
  getInitialState () {
    // Initial data, will be updated instantly
    return {
      legend: '..',
      previous: '..',
      since: ''
    };
  },
  updateLegend (result) {
    // Set the new legend
    this.setState(result);
  },
  componentWillMount () {
    // GET the initial data
    superagent.get('/api/').end((error, res) => {
      // TODO: Improve error handling
      if (!error) {
        let response = JSON.parse(res.text);
        this.setState(response);
        // Set the title to the current legend
        document.title = response.legend || document.title;
      }
    });
  },
  render () {
    let whenAuth = [
      <User info={this.state.user} key={1} />,
      <NewLegend legend={this.state.legend} update={this.updateLegend} key={2} />
    ];

    return (
      <div>
        <h1>Current Legend {this.state.legend}</h1>
        <p>Since {this.state.since} </p>
        <h2>Previous legend <strike>{this.state.previous}</strike></h2>

        <Auth loggedIn={this.state.userAuthenticated} />
        { this.state.userAuthenticated ? whenAuth : '' }
      </div>
    );
  }
});

export default Legend;
