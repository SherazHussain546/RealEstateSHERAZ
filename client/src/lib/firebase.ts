import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { create } from "zustand";

// Verify environment variables are properly loaded
const checkEnvVars = () => {
  const requiredVars = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(`Missing required Firebase configuration: ${missingVars.join(', ')}`);
  }

  return requiredVars;
};

const envVars = checkEnvVars();

const firebaseConfig = {
  apiKey: envVars.apiKey,
  authDomain: `${envVars.projectId}.firebaseapp.com`,
  projectId: envVars.projectId,
  storageBucket: `${envVars.projectId}.appspot.com`,
  appId: envVars.appId
};

console.log('Firebase Configuration:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  configValid: !!firebaseConfig.apiKey && !!firebaseConfig.appId
});

let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

const auth = getAuth(app);
const storage = getStorage(app);

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('Sign in successful:', result.user.email);
    } catch (error: any) {
      console.error('Error signing in:', error);
      if (error.code === 'auth/api-key-not-valid') {
        console.error('Invalid API key. Please check your Firebase configuration.');
      } else if (error.code.includes('identitytoolkit')) {
        console.error('Identity Toolkit API error. Please enable Identity Toolkit API in Google Cloud Console.');
        throw new Error('Firebase Authentication is not properly configured. Please contact the administrator.');
      }
      throw error;
    }
  },
  signOut: async () => {
    try {
      await auth.signOut();
      set({ user: null });
      console.log('Sign out successful');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }
}));

// Setup auth listener
onAuthStateChanged(auth, (user) => {
  useAuth.setState({ user, loading: false });
  console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
});

export { app, auth, storage };