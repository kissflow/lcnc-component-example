import React from 'react';
import './okr.css'
import Tabs from './widgets/tab'
import KPIIcon from './images/kpi.svg'
import Modal from './widgets/modal';

class OKR extends React.Component {
    constructor(props) {
        super(props);    
        this.state = {
          okrs: [],
          selectedOKR: null,
          show: false
        }
    }

    componentDidMount() {
      window.lcnc.api("/process/2/AcTGcH31RtTqP/admin/OKR_Management/item").then((res) => {
        this.setState({okrs : res.Data})
      });

      
    }

    openOKRForm = (okr) => {
      this.setState({ selectedOKR: okr, show: true });
    }
    closeOKRForm = () => {
      this.setState({ show: false });
    }

    render() {
        return (
          <>
          <div>
            <Tabs>
              {
                this.props.businessGroups.map(group =>
                  <div key={group.Name} label={group.Name} onClick={()=>{this.selectedGroup(group.Name)}}></div> 
                )
              }
            </Tabs>
          </div>
          <div id="kpi">
            <div className="section">
              <div className="section-heading">
                <div>KPIs</div>
                <div className="section-add">
                  <button className="button">+ Add New KPI</button>
                </div>
              </div>
              <div className="section-body">
                  <div style={{textAlign: "right"}}>
                    <img src={KPIIcon} alt="Low Code - Product has no KPIs yet."/>
                  </div>
                  <div> 
                    <div style={{paddingLeft: "5px"}}>Low Code - Product has no KPIs yet.</div>
                    <div style={{padding: "5px"}}>
                      <button className="button">+ Add New KPI</button> 
                      </div>
                  </div>
                  
              </div>
            </div>
          </div>
          <div id="okr" style={{marginTop: "20px"}}>
            <div className="section">
              <div className="section-heading">
                <div>OKRs</div>
                <div className="section-add">
                  <button className="button">+ Add New OKR</button>
                </div>
              </div>
              <div>
                <Tabs>
                {
                  ["Active", "Draft", "Closed", "All"].map(status =>
                    <div key={status} label={status}></div> 
                  )
                }
              </Tabs>
              </div>
              {this.state.okrs.length === 0&&
                <div className="section-body">
                  <div style={{textAlign: "right"}}>
                    <img src={KPIIcon} alt="Low Code - Product has no OKRs yet."/>
                  </div>
                  <div> 
                    <div style={{paddingLeft: "5px"}}>Low Code - Product has no OKRs yet.</div>
                    <div style={{padding: "5px"}}>
                      <button className="button">+ Add New OKR</button> 
                    </div>
                  </div>
                </div>
              }
              {this.state.okrs.length > 0&&
                <div className="section-okr">
                   {this.state.okrs.map((okr, index) => (
                     <div key={okr._id}>
                      <div className="okr-timeframe">
                        {okr.Timeframe}
                      </div>
                      <div className="okr-body">
                          <div className="okr-title">
                              <a onClick={()=> {this.openOKRForm(okr)}}>{okr.Name_}</a>
                          </div>
                          <div className="okr-des">
                            {okr.Description}
                          </div>
                          <div className="okr-details">
                              {okr.Owner && okr.Owner.Name}   {okr._status}
                          </div>
                      </div>
                     </div>
                   ))}
                </div>
              }
            </div>
          </div>
          <Modal show={this.state.show} handleClose={this.closeOKRForm} >
            <p>Modal</p>
            <p>Data</p>
          </Modal>
          </>
        );
      }
}

export default OKR;