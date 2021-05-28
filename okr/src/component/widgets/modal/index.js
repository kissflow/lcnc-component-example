import React, { Component } from "react";
import './modal.css';

class Modal extends Component {
  render() {
    const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
    return (
      <div className="modal" id="myModal" role="dialog" className={showHideClassName}>
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">OKR Form</h4>
            <button type="button" className="close" onClick={this.props.handleClose}>&times;</button>
          </div>
          <div className="modal-body">
            {this.props.children}
          </div>
          <div className="modal-footer" style={{display: "none"}}>
            <button type="button" onClick={this.props.handleClose}>Close</button>
          </div>
        </div>
      </div>
    ); 
  }
}

export default Modal;