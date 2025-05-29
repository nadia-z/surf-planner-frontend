import SurfPlanView from "./pages/SurfPlanView";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
       <SurfPlanView />
    </DndProvider>
  );
}

export default App;
