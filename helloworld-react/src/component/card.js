import React from 'react';
import PropTypes from 'prop-types';
import './card.css';

class Card extends React.Component {
    render() {
      return (
        <div className="card" style={{width: '18rem'}}>
            <img className="card-img-top" src="https://i.imgur.com/jRVDeI8.jpg" data-src="holder.js/100px180" alt="100%x180" style={{height: '180px', width: '100%', display: 'block'}}/>     
            <div className="card-body">
                <div className="card-title h5">{this.props.title}</div>
                <p className="card-text">{this.props.description}</p>
                <button type="button" className="card-button">Go somewhere</button>
            </div>
        </div>
      );
    }
  }

export default Card;