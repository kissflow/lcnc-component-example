import { DefaultLandingComponent } from "./landing/index.jsx";
import { TableDemo } from "./sprint-list/index.jsx";
import { SWRConfig } from "swr";

function App() {
  return (
    <div className="rootDiv">
      <SWRConfig
        value={{
          revalidateOnFocus: false,
        }}
      >
        {/* This is a default placeholder component, 
					remove this and add your own component */}
        {/* <DefaultLandingComponent /> */}
        <TableDemo />
      </SWRConfig>
    </div>
  );
}

export default App;
