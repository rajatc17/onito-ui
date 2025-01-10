import { useState, useMemo } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import RegisterPage from './pages/Users/RegisterPage';
import SignInPage from './pages/Users/SignInPage';
import { UserType } from './types';

function App() {
	const userFromStorage = sessionStorage.getItem('user');
	const [user, setUser] = useState<UserType | null>(userFromStorage ? JSON.parse(userFromStorage) : null);

	const authContextValue = useMemo(() => ({ user, setUser }), [user, setUser]);

	return (
		<Router>
			<AuthContext.Provider value={authContextValue}>
				<Routes>
					<Route
						path='/'
						element={
							<ProtectedRoute>
								<Home />
							</ProtectedRoute>
						}
					/>
					<Route path='/sign-in' element={<SignInPage />} />
					<Route path='/register' element={<RegisterPage />} />
				</Routes>
			</AuthContext.Provider>
		</Router>
	);
}

export default App;
