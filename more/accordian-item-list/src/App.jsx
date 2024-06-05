import { SprintTaskList } from "./item-list/index.jsx";
import { SWRConfig } from "swr";

function App() {
	return (
		<div className='rootDiv'>
			      <SWRConfig
        value={{
          revalidateOnFocus: false,
        }}
      >
				<SprintTaskList />
			</SWRConfig>
		</div>
	);
}

export default App;
