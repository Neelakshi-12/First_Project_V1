import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./screens/Home";
import Settings from "./screens/Settings";
import EditList from "./screens/EditList";
import Login from "./screens/Login";
import * as firebase from "firebase";

const Stack = createStackNavigator();
const AuthStack = createStackNavigator();
const AuthScreens = () => {
  return (
      <AuthStack.Navigator>
          <AuthStack.Screen name="Login" 
          component={Login} 
          options={() => {
            return {
                headerStyle: {
                    backgroundColor: "#000",
                },
                headerTintColor: "white",
            };
        }}
          />
      </AuthStack.Navigator>
  );
};
const Screens = () => {
   return(
    <Stack.Navigator>
    <Stack.Screen name="TODOS" 
    component={Home}
    options={() => {
      return {
          headerStyle: {
              backgroundColor: "#000",
          },
          headerTintColor: "white",
      };
  }}
    />
     <Stack.Screen name="Settings" component={Settings} 
      options={() => {
        return {
            headerStyle: {
                backgroundColor: "#000",
            },
            headerTintColor: "white",
        };
    }}
    />
    <Stack.Screen
        name="Edit"
        component={EditList}
        options={({ route }) => {
            return {
                title: route.params.title
                    ? `Edit ${route.params.title} list`
                    : "Create new list",
                headerStyle: {
                    backgroundColor: "#000",
                },
                headerTintColor: "white",
            };
        }}
    />
</Stack.Navigator>
   );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(()=> {
    if (firebase.auth().currentUser) {
      setIsAuthenticated(true);
  }
  firebase.auth().onAuthStateChanged((user) => {
      console.log("Checking auth state...");
      if (user) {
          setIsAuthenticated(true);
      } else {
          setIsAuthenticated(false);
      }
  });    
  },[]);
  return(
  <NavigationContainer>
    {isAuthenticated ? <Screens /> : <AuthScreens />}
  </NavigationContainer>
);
}

var firebaseConfig = {
  apiKey: "AIzaSyDTgHrphTU3WdvbGuNhbrs4a03z8hgE89w",
  authDomain: "reactnativefirstapp-917cc.firebaseapp.com",
  projectId: "reactnativefirstapp-917cc",
  storageBucket: "reactnativefirstapp-917cc.appspot.com",
  messagingSenderId: "415625380525",
  appId: "1:415625380525:web:37d4430fc09bff870a7c24"
};


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.firestore().settings({ experimentalForceLongPolling: true }); //add this..
} else {
  firebase.app(); // if already initialized, use that one
}
