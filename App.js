import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image,StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Homepage from './components/Homepage';
import ControlPage from './components/Controlpage';
import ProfilePage from './components/Profilepage';

const App = () => {
  Tab = createBottomTabNavigator()
  
  return (
    <NavigationContainer>
       <Tab.Navigator     tabBarOptions={{
      showIcon:true,
      activeTintColor: '#028090',
      inactiveTintColor:'#b7b7b7',
      labelStyle:{fontSize:12,marginBottom:10,marginTop:-10},
      style:{height:55,backgroundColor:'#fcfcfc',
       },  
 
      
    }}
     >
      <Tab.Screen  name="home" component={Homepage}
                  options={{
                            tabBarLabel:'Home',
                            tabBarIcon:({focused}) => {
                              return(
                                <Image source={require('./Images/home.png')}
                                       style={{width:22,height:22,
                                        tintColor:focused?'#028090':'#b7b7b7',
                     
                                       }}
                                       />
                              );},          
                            }} />
      <Tab.Screen name="control" component={ControlPage}
                  options={{
                    tabBarLabel:'Control',
                    tabBarIcon:({focused}) =>{
                     return <Image  style={{width:24,height:22,tintColor:focused?'#028090':'lightgray'}} 
                       source={require('./Images/control.png')}
                        />
                    }
                    }} />
     
      <Tab.Screen name="Profile" component={ProfilePage}
                  options={{
                    tabBarLabel:'profile',
                    tabBarIcon:({focused}) =>{
                      return <Image style={{width:22,height:22,tintColor:focused?'#028090':'lightgray'}}
                       source={require('./Images/user.png')} />
                    }
                    }} />
    </Tab.Navigator>
    </NavigationContainer>
  );
}
export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

});
