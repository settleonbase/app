//		APP.tsx

import React,{useState, useEffect} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import BeamioLanding from './BeamioLanding'
import TermsPage from './TermsPage'
import PrivacyPage from './PrivacyPage'
const App: React.FC = () => {

	return (
		<BrowserRouter>
		<Routes>
			<Route path="/" element={<BeamioLanding />} />
			<Route path="/terms" element={<TermsPage />} />
			<Route path="/privacy" element={<PrivacyPage />} />
		</Routes>
		</BrowserRouter>
	)
}

export default App