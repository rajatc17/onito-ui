import { initializeApp } from 'firebase/app';
import {
	GoogleAuthProvider,
	User,
	createUserWithEmailAndPassword,
	getAuth,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
} from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyADAgo1MHaGNElqt6N-yKTmxbT3J1uUxUQ',
	authDomain: 'onito-a2035.firebaseapp.com',
	projectId: 'onito-a2035',
	storageBucket: 'onito-a2035.firebasestorage.app',
	messagingSenderId: '588991167667',
	appId: '1:588991167667:web:76a347e2c2c24434c3c4c6',
	measurementId: 'G-Y5347GTNWS',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

// Google Auth function
const googleProvider = new GoogleAuthProvider();

export const logInWithEmailAndPassword = async (email: string, password: string): Promise<User | null> => {
	try {
		const res = await signInWithEmailAndPassword(auth, email, password);
		return res.user;
	} catch (err) {
		if (err instanceof Error) {
			// Handle authentication-specific errors gracefully
			console.error(err.message);
			alert(err.message);
		} else {
			console.error('Unexpected error', err);
		}
		return null; // Return null in case of error
	}
};

export const registerWithEmailAndPassword = async (
	name: string,
	email: string,
	password: string,
): Promise<User | null> => {
	try {
		const res = await createUserWithEmailAndPassword(auth, email, password);

		const userData = {
			uid: res.user.uid,
			name,
			email: res.user.email,
		};

		await setDoc(doc(db, 'users', res.user.uid), userData);

		return res.user;
	} catch (err) {
		if (err instanceof Error) {
			// Handle authentication-specific errors gracefully
			console.error(err.message);
			alert(err.message);
		} else {
			console.error('Unexpected error', err);
		}
		return null; // Return null in case of error
	}
};

export const logoutFirebase = () => {
	signOut(auth);
};

export const signInWithGoogle = async () => {
	try {
		// Sign in with Google
		const authResult = await signInWithPopup(auth, googleProvider);

		// Check if the user already exists in the database
		const userDocRef = doc(db, 'users', authResult.user.uid);
		const userDocSnapshot = await getDoc(userDocRef);

		if (!userDocSnapshot.exists()) {
			console.log('Adding a new user to the database.');
			// Add the user to the database if they don't exist
			const userData = {
				uid: authResult.user.uid,
				name: authResult.user.displayName,
				email: authResult.user.email,
			};
			await setDoc(userDocRef, userData);
		}

		return authResult.user;
	} catch (err) {
		console.error('Error during Google sign-in:', err);

		if (err instanceof Error) {
			// Handle authentication-specific errors gracefully
			alert(err.message);
		}

		return null; // Return null in case of error
	}
};
