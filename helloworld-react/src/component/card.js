import React from 'react';
import './card.css';
import logo from '../logo.svg';
import LCNC from '@kissflow/lcnc-sdk-js'

const lcnc = LCNC();

class Card extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      userProfile: {
        "Name": "Hello World"
      }
    }
    this.getProfileInfo = this.getProfileInfo.bind(this);
  }

  componentDidMount() {
    
  }

  getProfileInfo() {
    lcnc.api("/id").then((res) => {
      console.info("API response is", res);
      this.setState({ userProfile: res.UserDetails });
    });
  }

  _getProfileLogo() {
    return logo;
  }

  render() {
    return (
      <div className="card" style={{width: '18rem'}}>
          <div className="card-header">
            <img className="card-img" src={this._getProfileLogo()} alt="logo" />
          </div>
          <div className="card-body">
              <div className="card-title h5">{this.state.userProfile.Name}</div>
              <p className="card-text">{this.props.description}</p>
              <button type="button" className="card-button" onClick={this.getProfileInfo}>Get My Profile</button>
          </div>
      </div>
    );
  }
  
}

export default Card;