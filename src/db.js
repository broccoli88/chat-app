import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
	apiKey: "AIzaSyDGL6Y-r-yOmFHhEh-DWQrhzkn5HUCvcUc",
	authDomain: "tanukichat-3f0bc.firebaseapp.com",
	projectId: "tanukichat-3f0bc",
	storageBucket: "tanukichat-3f0bc.appspot.com",
	messagingSenderId: "209508067823",
	appId: "1:209508067823:web:ee6f17413f7016f8ca6e1a",
};

const appFireStore = initializeApp(firebaseConfig);

export default appFireStore;
