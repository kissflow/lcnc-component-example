import React from 'react';
import './main.css';
import { groupBy } from '../utils';
import { API } from '../utils/constants';
import OKR from './okr'
import PlusIcon from './images/plus.svg'
import HamburgerIcon from './images/hamburger.svg'
import UserIcon from "./widgets/usericon";

class Main extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      userProfile: {
        "Name": "Hello World"
      },
      businessUnits: {},
      selectedUnit: null
    }
    this.getProfileInfo = this.getProfileInfo.bind(this);
    this.additionalNav = ["Explore", "Reports", "Roadmap", "Settings"];
  }

  componentDidMount() {
    this.getBusinessGroups();
  }

  getProfileInfo() {
    window.lcnc.api("/id").then((res) => {
      console.info("API response is", res);
      this.setState({ userProfile: res.UserDetails });
    });
  }

  getBusinessGroups() {
    window.lcnc.api(API.BUSINESS_UNIT_LIST).then((res) => {
      console.info("API response is", res);
      const businessUnits = groupBy(res.Data, "Business_Unit");
      const selectedUnit = "LCNC";
      this.setState({ businessUnits, selectedUnit });
    });
  }

  setActiveUnit = (key) => {
    this.setState({ selectedUnit: key });
  }

  getSelectedBusinessGroups() {
    if(this.additionalNav.includes(this.state.selectedUnit)) {
      return [{"Name": "Objectives"}, {"Name": "Results"}, {"Name": "KPIs"}]
    }
    return this.state.businessUnits[this.state.selectedUnit] || [];
  }

  render() {
    return (
      <div id="container" className="container">
        <div id="nav-bar">
          <div className="nav-heading">
            <span>GROUPS </span>
            <span className="nav-add">
              <img className="card-img" src={PlusIcon} alt="logo" />
            </span>
          </div>
          <ul className="nav">
            {Object.keys(this.state.businessUnits).map((key, index) => (
              <li className={"nav-item" + (key === this.state.selectedUnit ? " active-item" : "")} key={key} onClick={()=>{this.setActiveUnit(key)}}>
                <span style={{ cursor: "pointer" }}>
                  <UserIcon
                    userId={key}
                    name={key}
                  />
                </span>
                <span style={{paddingLeft: "10px"}}>{key}</span>
              </li>
            ))}
          </ul>
          <div style={{borderTop: "1px solid lightgray", margin: "5px 0"}}></div>
          <ul className="nav">
            {this.additionalNav.map((key, index) => (
              <li className={"nav-item" + (key === this.state.selectedUnit ? " active-item" : "")} key={key} onClick={()=>{this.setActiveUnit(key)}}>
                <span style={{ cursor: "pointer" }}>
                  <UserIcon
                    userId={key}
                    name={key}
                  />
                </span>
                <span style={{paddingLeft: "10px"}}>{key}</span>
              </li>
            ))}
          </ul>
        </div>
        <div id="main-container">
          {this.state.selectedUnit &&
          <OKR key={this.state.selectedUnit} unit={this.state.selectedUnit} businessGroups={this.getSelectedBusinessGroups()}>

          </OKR>
          }
        </div>
      </div>
    );
  }

}

export default Main;