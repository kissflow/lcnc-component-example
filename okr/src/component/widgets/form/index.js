import React from 'react';
import './form.css';

class OKRForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          okr: this.props.okr || {}
        };
      }
    
      handleChange = (event) => {
        this.setState({value: event.target.value});
      }
    
      handleSubmit = (event) => {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
      }
    
      render() {
        const okr = this.props.okr || {};
        return (
          <form onSubmit={this.handleSubmit}>
            <label>Name:</label>
            <input type="text" name="Name_1" value={okr.Name_1} onChange={this.handleChange} />
            <label>Description:</label>
            <textarea value={okr.Description} onChange={this.handleChange} />
            <label>Timeframe:</label>
            <select value={okr.Timeframe} onChange={this.handleChange}>
                <option value="Q3 2021">Q3 2021</option>
                <option value="Q4 2021">Q4 2021</option>
                <option value="Q1 2022">Q1 2022</option>
                <option value="Q2 2022">Q2 2022</option>
            </select>

            <div style={{textAlign: "right"}}>
              <input className="submit" type="submit" value="Submit" />
            </div>
          </form>
        );
      }
}

export default OKRForm;