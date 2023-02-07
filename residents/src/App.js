import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import Login from "../src/routes/login.jsx";
import VideoPage from "./routes/videoPage.jsx";

function App() {
	return (
		<div>
			<Router>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/videos" element={<VideoPage />} exact />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
