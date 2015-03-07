let Auth = React.createClass({
  render () {
    return (
      <div>
        { this.props.loggedIn ? (<a href='/logout'>Logout</a>) : (<a href='/verify'>Authenticate</a>) }
      </div>
    );
  }
});

export default Auth;
