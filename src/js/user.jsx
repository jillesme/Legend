let User = React.createClass({
  render () {
    return (
      <div>
        <p><img src={this.props.info.image} width="50" height="50" /> {this.props.info.name }</p>
      </div>
    );
  }
});

export default User;
