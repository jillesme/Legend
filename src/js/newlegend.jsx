let NewLegend = React.createClass({
  setLegend () {
    // Input field value
    let legend = this.refs.newlegend.getDOMNode().value;

    // Can only be a-z and spaces, min 3 max 18 in length
    if (!/^[a-z\s]{3,18}$/gi.test(legend)) {
      // TODO: Better error handling
      alert(`Invalid legend "${legend}" `);
      return;
    }

    // Make POST request
    superagent.post('/api/').send({
      newLegend: legend
    }).end((error, res) => { // COMPLETE:
      if (!error) {
        let response = JSON.parse(res.text);
        if (response.error) {
          // TODO: Better error handling
          alert(response.error);
        } else {
          // Update the legend (in legend.jsx)
          this.props.update(response);
        }
      }
    });

  },
  render () {
    return (
      <div>
        <p>New Legend: </p>
        <input type="text" placeholder={this.props.legend} ref="newlegend" />
        <button onClick={this.setLegend}>Save</button>
      </div>
    )
  }
});

export default NewLegend;
