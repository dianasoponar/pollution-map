import firebase from "firebase";
import { FirebaseApiKey } from "./components/apiKeys.js";

const config = {
    apiKey: FirebaseApiKey,
    authDomain: "pollution-map-react.firebaseapp.com",
    databaseURL: "https://pollution-map-react.firebaseio.com",
    projectId: "pollution-map-react",
    storageBucket: "pollution-map-react.appspot.com",
    messagingSenderId: "962989338114",
    appId: "1:962989338114:web:b3e60f38d0f85f0714811b"
};
// Initialize Firebase
firebase.initializeApp(config);

export default firebase;