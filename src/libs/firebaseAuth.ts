
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDGlZpkWwf4ti48Z3nB4qvaExEr2yVYppE",
  authDomain: "mapmaker-620cb.firebaseapp.com",
  projectId: "mapmaker-620cb",
  storageBucket: "mapmaker-620cb.appspot.com",
  messagingSenderId: "808593861615",
  appId: "1:808593861615:web:ee1c5a8c225eb28e55e41a",
}

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_SENDER_ID,
// };

const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);

export default firebaseAuth;