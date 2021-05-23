import './App.css';
import Main from './component/main';
import LCNC from '@kissflow/lcnc-sdk-js'
import MockLCNC from './mock/lcnc-sdk';

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  window.lcnc = MockLCNC();
} else {
  window.lcnc = LCNC();
}

function App() {
  return (
    <div className="App">
       <Main></Main>
    </div>
  );
}

export default App;
