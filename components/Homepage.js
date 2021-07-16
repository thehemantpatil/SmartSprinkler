import React,{useState,useEffect,} from 'react';
import { Image,StatusBar,Switch, StyleSheet, Text, View,Modal, TouchableOpacity, AsyncStorage, ToastAndroid } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { useIsFocused } from '@react-navigation/native';

const Homepage = () =>{
    const isfocused = useIsFocused()
    console.log(isfocused,'its')
    const [data,setData] = useState([]);
    const [loading,setLoading] = useState(true);
    const [refresh,setrefresh] = useState(false)
    let toggle = null
    const [modalVisible,setModalVisible] = useState(false);
    let [fontsLoaded] = useFonts({
        'Poppins': require('../fonts/Poppins-Medium.ttf'),
      });
    //   https://api.npoint.io/993bd526f1004285d9e1
    useEffect(() => {
        setrefresh(false)
        fetch('http://192.168.43.225:3000/index') 
          .then((response) => response.json())
          .then((dat) => {setData(dat);console.log(data)})
          .catch((error) => console.error(error))
          .finally(() => setLoading(false));
          
      },[refresh][isfocused]);
    function setup(){ 
           
           if(data['mode']=='Auto'){
               toggle = true 
           }
           else{
               toggle = false
           }
         
    }
  function updatemode(){
          try{
              fetch('http://192.168.43.225:3000/index/mode', {
                    method: 'POST',
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                    },
        body: JSON.stringify({
          'mode': toggle?'Manual':'Auto'
        })
      })
      setrefresh(true)
      }
    
      catch(error){
          toggle = !toggle;
          ToastAndroid.show("Could Not Updated!")
      }
    
    }
    if(!fontsLoaded){
    return(
        <View></View>
    )
    }
    else{
    return(
       
        <View style={{flex:1}}>
            {setup()}
             <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            
      >
         <View style={{marginTop:hp('25%'),
    marginHorizontal:wp('18%'),
    backgroundColor: "white",
    borderRadius: 12,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5}}>
        <Text style={{fontFamily:'Poppins',fontWeight:'bold',
           fontSize:wp('5.5%')}}>Confirm</Text>
        <Text style={{marginVertical:10,fontSize:wp('4.5%')}}>Do you want to change the mode.</Text>
        <View style={{flexDirection:'row',alignSelf:'flex-end',marginTop:wp('10%')}}>
            <TouchableOpacity onPress={()=>{
                toggle = !toggle;
                setModalVisible(false)
            }} style={{alignSelf:'center',marginRight:20}} ><Text style={{fontSize:wp('5%')}}>No</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>{
                updatemode();
                setTimeout(()=>{ 
                   setrefresh(true);
                },1000)
                setModalVisible(false);
            }} style={{backgroundColor:'#36D5F0', paddingVertical:13,
          paddingHorizontal:36,marginVertical:10,elevation:5,
        borderRadius:5}}><Text style={{color:'white',fontSize:wp('4.5%')}}>Yes</Text></TouchableOpacity>
        </View>
        </View>
        </Modal>
            <View style={styles.header}>
                <Text style={styles.headtxt}>Home</Text>
            </View>
            <View style={{flex:1,justifyContent:'space-evenly'}}> 
                <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
                    <LinearGradient colors={['#FE6A68','#FF6968']} style={{position:'relative', width:wp('44%'),height:wp('55%'),
                        borderRadius:wp('8%'),elevation:10}}>
                    <View style={{position:'absolute',width:wp('18%'),
                          height:wp('18%'),borderRadius:wp('12%'),right:0,
                        backgroundColor:'#f4867f',elevation:6,justifyContent:'center'}}>
                    <Image style={{alignSelf:'center', width:wp('10%'),height:wp('10%'),tintColor:'white'}} source={require('../Images/thermometer.png')}  />
                    </View>
                    <Text style={{fontSize:wp('3.8%'), color:'white',opacity:0.9, fontFamily:'Roboto',marginLeft:wp('4%'),marginTop:wp('5%'),}}>Temp</Text>
                    <Text style={{color:'white',opacity:0.9, 
                    fontFamily:'Poppins',marginLeft:wp('7%'),
                    marginTop:wp('12%'),fontSize:wp('6%'),letterSpacing:2}}>{data['temps']}°C</Text>
                   <View style={{alignSelf:'flex-end',marginTop:wp('7%'),
                  width:'100%',paddingHorizontal:wp('5%')}}>
                    <Text style={{fontFamily:'Roboto',color:'white',alignSelf:'flex-end',letterSpacing:1.2}} >28°C-35°C</Text>
                    <Text style={{fontFamily:'Roboto',color:'white',alignSelf:'flex-end'}}>Good</Text>
                 </View>
                   
                    </LinearGradient>
                  {/* Moisture */} 

                  <LinearGradient colors={['#7a54ff','#7b55ff','#7854fd']} style={{position:'relative', width:wp('44%'),height:wp('55%'),
                        borderRadius:wp('8%'),elevation:5}}>
                    <View style={{position:'absolute',width:wp('18%'),
                          height:wp('18%'),borderRadius:wp('12%'),right:0,
                        backgroundColor:'#936afe',elevation:6,justifyContent:'center'}}>
                    <Image style={{alignSelf:'center', width:wp('10%'),height:wp('10%'),tintColor:'white'}} source={require('../Images/moisture.png')}  />
                    </View>
                    <Text style={{fontSize:wp('3.8%'), color:'white',opacity:0.9, fontFamily:'Roboto',marginLeft:wp('6%'),marginTop:wp('5%'),}}>Moisture</Text>
                    <Text style={{color:'white',opacity:0.9, 
                    fontFamily:'Poppins',marginLeft:wp('7%'),
                    marginTop:wp('12%'),fontSize:wp('6%'),letterSpacing:2}}>{data['moisture']}%</Text>
                   <View style={{alignSelf:'flex-end',marginTop:wp('7%'),
                  width:'100%',paddingHorizontal:wp('5%')}}>
                    <Text style={{fontFamily:'Roboto',color:'white',alignSelf:'flex-end',letterSpacing:1.2}} >10%-49%</Text>
                    <Text style={{fontFamily:'Roboto',color:'white',alignSelf:'flex-end'}}>Good</Text>
                 </View>
                   
                    </LinearGradient> 
                 

                </View>
                {/* Humidity */}
                <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
                    <LinearGradient colors={['#ff8f61','#ff9062','#ff8c5a',
                    '#ff8f5e','#ff9067','#fc9062']} style={{position:'relative', width:wp('44%'),height:wp('55%'),
                        borderRadius:wp('8%'),elevation:5}}>
                    <View style={{position:'absolute',width:wp('18%'),
                          height:wp('18%'),borderRadius:wp('12%'),right:0,
                        backgroundColor:'#fbaa79',elevation:6,justifyContent:'center'}}>
                    <Image style={{alignSelf:'center', width:wp('10%'),height:wp('10%'),tintColor:'white'}} source={require('../Images/humidity.png')}  />
                    </View>
                    <Text style={{fontSize:wp('3.8%'), color:'white',opacity:0.9, fontFamily:'Roboto',marginLeft:wp('4%'),marginTop:wp('5%'),}}>Humidity</Text>
                    <Text style={{color:'white',opacity:0.9, 
                    fontFamily:'Poppins',marginLeft:wp('7%'),
                    marginTop:wp('12%'),fontSize:wp('6%'),letterSpacing:2}}>{data['humidity']}%</Text>
                   <View style={{alignSelf:'flex-end',marginTop:wp('7%'),
                  width:'100%',paddingHorizontal:wp('5%')}}>
                    <Text style={{fontFamily:'Roboto',color:'white',alignSelf:'flex-end',letterSpacing:1.2}} >50%-60%</Text>
                    <Text style={{fontFamily:'Roboto',color:'white',alignSelf:'flex-end'}}>Good</Text>
                 </View>
                   
                    </LinearGradient>
                  {/* Raining */} 

                  <LinearGradient colors={['#2cc1ff','#2cbdff','#2bc4fe','#2ac3ff',
                       '#2bc2ff','#22c6ff','#24c5fd','#27c1ff','#2ac3fe']} style={{position:'relative', width:wp('44%'),height:wp('55%'),
                        borderRadius:wp('8%'),elevation:10}}>
                    <View style={{position:'absolute',width:wp('18%'),
                          height:wp('18%'),borderRadius:wp('12%'),right:0,
                        backgroundColor:'#3bd3ff',elevation:6,justifyContent:'center'}}>
                    <Image style={{alignSelf:'center', width:wp('10%'),height:wp('10%'),tintColor:'white'}} source={require('../Images/rainy.png')}  />
                    </View>
                    <Text style={{fontSize:wp('3.8%'), color:'white',opacity:0.9, fontFamily:'Roboto',marginLeft:wp('6%'),marginTop:wp('5%'),}}>Raining</Text>
                    <Text style={{color:'white',opacity:0.9, 
                    fontFamily:'Poppins',marginLeft:wp('7%'),
                    marginTop:wp('12%'),fontSize:wp('6%'),letterSpacing:2,marginLeft:wp('10%')}}>{data['raining']}</Text>
                   {/* <View style={{alignSelf:'flex-end',marginTop:wp('7%'),
                  width:'100%',paddingHorizontal:wp('5%')}}>
                    <Text style={{fontFamily:'Roboto',color:'white',alignSelf:'flex-end',letterSpacing:1.2}} >10%-49%</Text>
                    <Text style={{fontFamily:'Roboto',color:'white',alignSelf:'flex-end'}}>Good</Text>
                 </View> */}
                   
                    </LinearGradient> 
                 

                </View>
                <View>
                 <Switch
                    style={{alignSelf:'center',}}
                    trackColor={{false: 'gray', true: 'green'}}
                    thumbColor="white"
                    ios_backgroundColor="green"
                    onValueChange={(value) => {toggle = value;setModalVisible(true)}}
                    value={toggle}
                 />
                 <Text style={{alignSelf:'center',backgroundColor:"green",fontFamily:'Roboto',
                     elevation:2,padding:8,color:'white',marginTop:8,borderRadius:5}}>{toggle?'Auto':'Manual'}</Text>
                 </View>
            </View>
         <StatusBar />
        </View>
    ) 
    }
}

export default Homepage;

const styles = StyleSheet.create({
    header:{
        height:hp('6.5%'),
        backgroundColor:'white',
        elevation:5,
        alignItems:'center',
        justifyContent:'center'
    },
   headtxt:{
       fontFamily:'Roboto',
       fontSize:wp('5%'),
       fontWeight:'bold',

   } 
})