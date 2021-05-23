import React, { Component } from "react";
import PropTypes from "prop-types";
import './modal.css';

class Modal extends Component {
    render() {
        const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
        return (
            <div className={showHideClassName}>
              <section className="modal-main">
                {this.props.children}
                <button type="button" onClick={this.props.handleClose}>
                  Close
                </button>
              </section>
            </div>
          ); 
    }
}

export default Modal;