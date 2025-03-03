import { BrowserRouter, Routes, Route } from "react-router";
import Envelopes from "./Envelopes";
import Documents from "./Documents";
import DocViewer from "./DocViewer";

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={<Envelopes />}
				/>
				<Route
					path="/:envelopeId/documents"
					element={<Documents />}
				/>
				<Route
					path="/:envelopeId/documents/:documentId"
					element={<DocViewer />}
				/>
			</Routes>
		</BrowserRouter>
	);
};

export default App;
