import './App.css';
import Main from './component/main-layout';

import LCNC from './mock/lcnc-sdk';
window.lcnc = LCNC();

function App() {
  return (
    <div className="App">
       <Main>

       </Main>
    </div>
  );
}

export default App;
