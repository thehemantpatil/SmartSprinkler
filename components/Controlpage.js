import React,{useEffect,useState} from 'react';
import {Animated,Easing,AsyncStorage,TextInput,Switch, Modal, Image,StatusBar,StyleSheet, Text, TouchableOpacity, View, FlatList,Pressable } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useFonts } from 'expo-font'; 
import { useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';

const ControlPage = () =>{
    const time = new Date();
    const isfocused = useIsFocused();
    const valves = ['Valve1','Valve2']
    const crops = ['Cotton','Jowar']
    let [fontsLoaded] = useFonts({
        'Poppins': require('../fonts/Poppins-Medium.ttf'),
      });
    const [modalVisible_a,setModalVisible_a] = useState(false)
    const [cropage,setcropage] = useState(null)
    const [popup,setpopup] = useState(false)
    const [cntrl,setcontrl] = useState(true)
    const [data,setData] = useState([])
    const [showcrops,setshowcrops] = useState(false)
    const [showvalvename,setshowvalvename] = useState(false)
    const [refresh,setrefresh] = useState(false)
    const [modalVisible,setModalVisible] = useState(false);
    const [valveName,setValveName] = useState("");
    const [valveDesc,setValveDesc] = useState("");
    const [cropType,setcropType] = useState("");
    const [edit,setEdit] = useState(false);
    const [editKey,setEditKey] = useState(null);
    const value = useState(new Animated.Value(71))[0];
    const [show,setshow] =  useState(false);
    const [loading,setLoading] =  useState(true);
    const [cover,setcover] = useState(false);
    const [modalname,setModalname] = useState(['v1',0]);
    const [valveStatus,setValveStatus] = useState([])
    let fetchdata = []
    const [dummydata,setdummy] = useState(null)
    const [mode,setmode] = useState(null);
    function changeValue(){
        Animated.timing(value,{
            toValue:0,
            duration:400,
            useNativeDriver:true
        }).start()  
    }
     
    const storeValveData = async(valveName,cropType,valveDesc)=>{
        try{
           
           if(await AsyncStorage.getItem('Valvedata')==null){
                await AsyncStorage.setItem('Valvedata',JSON.stringify([{Name:valveName,type:cropType,desc:valveDesc}]))
                
           }
           else{ 
               let arr = JSON.parse(await AsyncStorage.getItem('Valvedata'))
               arr.push({Name:valveName,type:cropType,desc:valveDesc})
               await AsyncStorage.setItem('Valvedata',JSON.stringify(arr))
           }
           setData(JSON.parse(await AsyncStorage.getItem('Valvedata')))
           
        }
        catch(error){
            console.log(error);
        } 
    }
    function setupValue(){
        (async()=>{
           let arr = JSON.parse(await AsyncStorage.getItem('Valvedata'));
           if(arr != null){
              setshow(false)
           }
           else{
               setshow(true)
           }
           
           if(edit==false)
             if(arr != null){
             setValveName("Valve"+(arr.length+1).toString())
             }
             else{
                setValveName("Valve1")
             }
    })();}
    const editStoredata = async(valveName,cropType,valveDesc)=>{
         try{
            let arr = JSON.parse(await AsyncStorage.getItem('Valvedata'));
            arr.map((item)=>{
               
                if(item.Name == editKey){
                    item.Name = valveName;
                    item.desc = valveDesc;
                    item.type = cropType;
                }
            }) 
            await AsyncStorage.setItem('Valvedata',JSON.stringify(arr));
            setData(JSON.parse(await AsyncStorage.getItem('Valvedata')))
            setEdit(false);
            setEditKey(null);
            setcropType(null);
            setValveName(null);
            setValveDesc(null);
         }
         catch(error){
             console.log(error)
         }
    }

    const removeData=(valveName)=>{
        fetch('http://192.168.43.225:3000/index/remove', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'vname':valveName,
     
        })
      });
   }
   function manualControl(Name){
 
    fetch('http://192.168.43.225:3000/index/manual', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'name':Name[0],
          'value':!Name[1]
        })
      });
      
      
   }
   function sendData(valvename,croptype,valvedesc,cropage){
       console.log(valvename,croptype,valvedesc)
    fetch('http://192.168.43.225:3000/index/crop', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'valvename':valvename,
          'croptype':croptype,
          'desc':valvedesc,
          'age':cropage,
        })
      });
     return 0 
   }
   
   

   useEffect(() => {
    // (async()=>{
    //    if(await AsyncStorage.getItem('Valvedata')!=undefined){
    //        setData(JSON.parse(await AsyncStorage.getItem('Valvedata')))
    //    }
      
    // })();
      setrefresh(false)
      
     fetch("http://192.168.43.225:3000/index/crop")
    .then((response)=>response.json())
    .then((dataa)=>{if(dataa!=null){
                             setData([dataa['Valve1'],dataa['Valve2']]);
                             setLoading(false);
                             if(dataa['mode']=='Auto'){
                               setmode(true);
                             }
                             else{
                                 setmode(false)
                             }
                             console.log(data,'dj')
                             setshow(false)
                              }
                    else{
                        setshow(true)
                        setLoading(false);
                    }
                
                console.log(data,'data')
                console.log(mode,'mode')
                console.log(show,'show')
            })
                 
    .catch((error)=>{console.log(error);
           throw error;
    })
    // if(dummydata==null){
    //     setrefresh(true)
    // }
    // else{ 
    //     console.log(refresh)
    //     console.log(dummydata,'ur')
    //     setrefresh(false)
    // }
  },[refresh][isfocused]);
   
// fetchdata[item.Name].status?'#469a20':'#FE6A68'
// fetchdata[item.Name].status?'OFF':'ON'   
    const renderItem = ({item}) =>{
        console.log(data,'dd')
        console.log(parseInt(time.getHours().toString() +  time.getMinutes().toString()),'djeje')
        if(item.croptype != null)
        return(
        <View style={styles.controlView}>
        <View style={styles.textView}>
            <View>
              <View style={{flexDirection:'row'}}>
                <Text style={{fontFamily:'Poppins',fontWeight:'bold',
                fontSize:wp('5.5%'),opacity:0.8}}>{item.valveName}</Text>
              <View style={{width:10,height:10,
                borderRadius:10,backgroundColor:item.status?'#469a20':'#FE6A68',
                alignSelf:'center',marginLeft:3}} ></View>
              </View>
               <Text style={{fontFamily:'Roboto',
              fontSize:wp('4.5%'),opacity:0.8}}>- {item.desc}</Text>
              <Text style={{fontFamily:'Roboto',
              fontSize:wp('4.5%'),opacity:0.8}}>- {item.croptype}</Text>
              <Text style={{fontFamily:'Roboto',
              fontSize:wp('4.5%'),opacity:0.8}}>- {item.age} day</Text>
            </View>
            <View>
                <TouchableOpacity onPress={()=>{setModalVisible(true);
                                               setEdit(true);
                                               setEditKey(item.valveName);
                                               setValveName(item.valveName);
                                               setValveDesc(item.desc);
                                               setcropType(item.croptype)}}>
                    <Image style={{width:wp('5.5%'),height:wp('5.5%'),marginTop:5}} source={require('../Images/edit.png')} />
                </TouchableOpacity>
            </View>
        </View>
        <View style={{marginTop:wp('3%'),flexDirection:'row',justifyContent:'space-between'}}>
            <TouchableOpacity onPress={()=>{
                setModalname([item.valveName,item.status])
                
                setModalVisible_a(true)
                setpopup(false)  
            }} style={{alignItems:'center',alignSelf:'center',
             justifyContent:'center',backgroundColor:'#36D5F0',
             height:hp('6%'),width:'45%',borderRadius:wp('2%')}} >
               <Text style={{color:'white',fontWeight:'bold'}}>{item.status?'OFF':'ON' }</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{removeData(item.valveName);setpopup(false);setrefresh(true)}}
             style={{alignItems:'center',alignSelf:'center',
             justifyContent:'center',backgroundColor:'#36D5F0',
             height:hp('6%'),width:'45%',borderRadius:wp('2%')}} >
               <Text style={{color:'white',fontWeight:'bold'}}>Remove</Text>
            </TouchableOpacity>
        </View>
        <View style={{flex:0.9,justifyContent:'flex-end'}}>
        <View style={{flexDirection:'row',justifyContent:'space-between',
                      }}>
            <View>
            {/* {parseInt(time.getHours().toString() +  time.getMinutes().toString())- parseInt(item.time)}{item.status?' min':" min Ago"} */}
                <Text style={{fontFamily:'Poppins',fontWeight:'bold'}}>Active</Text>  
                <Text style={{fontFamily:'Roboto'}}>{item.status?'from ':""}{parseInt(time.getHours().toString() +  time.getMinutes().toString())- parseInt(item.time)}{item.status?' min':" min Ago"}</Text> 
            </View>
            <View>
                <Text style={{fontFamily:'Poppins',fontWeight:'bold'}}>Moisture</Text>
                <Text style={{fontFamily:'Roboto'}}>{item.moisture}%</Text>
            </View>
        </View>
        </View>
        </View>
        )
    }
    // {dummydata[item.Name].moisture}
    if(!fontsLoaded){
        return(
            <View></View>
        )
        }
    else{
    return(
        <View  style={{flex:1,backgroundColor:'#f5f5f5'}}>
            
            <Pressable onPress={()=>{setpopup(false)}} style={{flex:1}}>
            
            {changeValue()}
            {/* {setupValue()} */}
            <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible_a}
            
      >
         <View style={{marginTop:hp('25%'),
    marginHorizontal:wp('10%'),
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
        <Text style={{marginVertical:10,fontSize:wp('4.5%')}}>{mode?"Switch to Manual Mode and ":
                     ""}{modalname[1]?"Turn Off the ":"Turn ON the "}{modalname[0]}</Text>
        <View style={{flexDirection:'row',alignSelf:'flex-end',marginTop:wp('10%')}}>
            <TouchableOpacity onPress={()=>{
                setModalVisible_a(false)
            }} style={{alignSelf:'center',marginRight:20}} ><Text style={{fontSize:wp('5%')}}>No</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>{
                manualControl(modalname);
                setLoading(true);
                setTimeout(() => {
                  setrefresh(true);
                }, 5000);
                
                
                
                setModalVisible_a(false);
            }} style={{backgroundColor:'#36D5F0', paddingVertical:13,
          paddingHorizontal:36,marginVertical:10,elevation:5,
        borderRadius:5}}><Text style={{color:'white',fontSize:wp('4.5%')}}>Yes</Text></TouchableOpacity>
        </View>
        </View>
        </Modal>
       
            <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            
      >
        <Pressable onPress={()=>{setshowcrops(false);setshowvalvename(false)}}>
         <View style={{marginVertical:hp('7%'),
    marginHorizontal:20,
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
        <View>
           <Text style={{alignSelf:'flex-start',fontSize:wp('5%'),color:'#36D5F0', fontFamily:'Poppins',}}> {cover?"Cover Name":"Valve Name"}</Text>
     
             <TextInput  value={cover?"Cover1":valveName}
               editable={cover?false:true} 
               onFocus={()=>setshowcrops(false)}
               onChangeText={(text)=>{setshowvalvename(true);setValveName(text)}} 
               placeholder="Select Valve"  
               style={{width:'100%',height:40,borderColor:showvalvename?'white':'#36D5F0',backgroundColor:'white',
               borderWidth:showvalvename?0:1,borderRadius:7,marginVertical:10,borderBottomLeftRadius:showvalvename?0:7,
               borderBottomRightRadius:showvalvename?0:7,paddingLeft:10,elevation:showvalvename?10:0}} /> 
    
             {showvalvename?<View style={{width:'100%',position:'absolute',zIndex: 1,
               bottom:-69,backgroundColor:'white',elevation:10,
               borderBottomEndRadius:7,borderBottomLeftRadius:7}}>
                    <Pressable onPress={()=>{setValveName("Valve1");setshowvalvename(false)}}>
                       <Text style={{padding:10,opacity:0.8,fontSize:wp('4.5%')}}>Valve1</Text>
                    </Pressable> 
              <Pressable onPress={()=>{setValveName("Valve2");setshowvalvename(false)}}> 
                <Text style={{padding:10,paddingTop:0, opacity:0.8,fontSize:wp('4.5%')}}>Valve2</Text> 
              </Pressable>
               </View>:<View />}
               </View>
            


            {cover?<View />:<View>
             <Text style={{alignSelf:'flex-start',fontSize:wp('5%'),color:'#36D5F0', fontFamily:'Poppins',}}>Crop Type</Text>
             <TextInput defaultValue={cropType} 
                onFocus={()=>setshowvalvename(false)}
                onChangeText={(text)=>{setshowcrops(true);setcropType(text)}} 
                placeholder="Select Crop"  
                style={{width:'100%',height:40,borderColor:showcrops?'white':'#36D5F0',backgroundColor:'white',
                borderWidth:showcrops?0:1,borderRadius:7,marginVertical:10,borderBottomLeftRadius:showcrops?0:7,
                borderBottomRightRadius:showcrops?0:7,paddingLeft:10,elevation:showcrops?10:0}} />
             {showcrops?<View style={{width:'100%',position:'absolute',zIndex: 1,
               bottom:-69,backgroundColor:'white',elevation:10,
               borderBottomEndRadius:7,borderBottomLeftRadius:7}}>
                    <Pressable onPress={()=>{setcropType("Cotton");setshowcrops(false)}}>
                       <Text style={{padding:10,opacity:0.8,fontSize:wp('4.5%')}}>Cotton</Text>
                    </Pressable> 
              <Pressable onPress={()=>{setcropType("Jowar");setshowcrops(false)}}> 
                <Text style={{padding:10,paddingTop:0, opacity:0.8,fontSize:wp('4.5%')}}>Jowar</Text> 
              </Pressable>
               </View>:<View />}
            </View>
            }
            {cover?<View />:<View>
             <Text style={{alignSelf:'flex-start',fontSize:wp('5%'),color:'#36D5F0', fontFamily:'Poppins',}}>Crop Age</Text>
             <TextInput defaultValue={cropage} 
                onFocus={()=>{setshowvalvename(false);setshowcrops(false)}}
                onChangeText={(text)=>{setcropage(text)}} 
                placeholder="Enter Crop age"  
                style={{width:'100%',height:50,borderColor:showcrops?'white':'#36D5F0',backgroundColor:'white',
                borderWidth:showcrops?0:1,borderRadius:7,marginVertical:10,borderBottomLeftRadius:showcrops?0:7,
                borderBottomRightRadius:showcrops?0:7,paddingLeft:10,elevation:showcrops?10:0}} />
                </View>}
             <Text style={{alignSelf:'flex-start',fontSize:wp('5%'),color:'#36D5F0', fontFamily:'Poppins',}}>Desciption</Text>
             <TextInput defaultValue={valveDesc} multiline={true} onChangeText={(text)=>setValveDesc(text)}  placeholder="Enter Description"  style={{width:'100%',height:100,borderColor:'#36D5F0',borderWidth:1,borderRadius:7,marginVertical:10,paddingLeft:10}} />
             <View style={{flexDirection:'row',marginTop:10,alignSelf:"flex-end"}} >
              <TouchableOpacity onPress={()=>{setModalVisible(!modalVisible);
                                              setcropType(null);
                                              setValveName(null);
                                              setValveDesc(null);}}
               style={[styles.yesbtn,{backgroundColor:'white',elevation:0}]}><Text style={{fontFamily:'Poppins',color:'gray',fontSize:wp('5%'),}}>Cancel</Text></TouchableOpacity> 
              <TouchableOpacity onPress={()=>{
                if(cropType==null){
                    Toast.show("Please Provide CropType")
                }
                else if(valveDesc==null){
                    Toast.show("Please Provide Valve Description")
                }
                else{
                if(cropType != 'Cotton' && cropType !="Jowar"){
                        Toast.show("Please Provide Valid CropType")
                    }
                else{
                 setModalVisible(false);
                 if(edit == false){
                    // storeValveData(valveName,cropType,valveDesc)
                    sendData(valveName,cropType,valveDesc,cropage)
                    setrefresh(true)
                    setshow(true)
                
                }
                else{
                    // editStoredata(valveName,cropType,valveDesc)
                    sendData(valveName,cropType,valveDesc,cropage)
                }
            }
            }
              }} style={styles.yesbtn}><Text style={{fontSize:wp('5%'), fontFamily:"sans-serif-medium",color:'white'}}>Save</Text></TouchableOpacity>
               
             </View>
  </View>
  </Pressable>
  </Modal>
            
             <View style={styles.header}>
                 <Text style={[styles.headtxt,{marginLeft:wp('40%')}]}>Control</Text>
            </View>  
            {loading?<View style={{justifyContent:'center',alignItems:'center',marginTop:hp('40%')}}><Text style={{fontFamily:"Poppins",fontSize:22,opacity:0.8}} >Loading...</Text></View>:
           show?<View style={{justifyContent:'center',alignItems:'center',marginTop:hp('40%')}}><Text style={{fontFamily:"Poppins",fontSize:22,opacity:0.8}} >Add Farm Details...</Text></View>:
            <FlatList 
               data={data}
               renderItem={renderItem}
               keyExtractor={(item)=>item.valveName}
               />
   } 
              {popup?
               <View style={{position:'absolute',bottom:100,right:70}}>
                <TouchableOpacity onPress={()=>{setcover(true);setpopup(false);setModalVisible(true);}}><Text style={{backgroundColor:'white',padding:10,elevation:5,marginBottom:15,fontFamily:"Poppins"}}>Add Cover</Text></TouchableOpacity> 
                <TouchableOpacity onPress={()=>{setcover(false);setpopup(false);setModalVisible(true);}}><Text style={{backgroundColor:'white',padding:10,elevation:5,fontFamily:"Poppins"}}>Add Valve</Text></TouchableOpacity>
                </View>:<View />}
                <Animated.View style={{shadowOffset:{
                    width:15,
                    height:15
                },transform:[{translateY:value}], elevation:5, alignItems:'center',justifyContent:'center', position:'absolute',bottom:25,right:20,
                  backgroundColor:'#36D5F0',width:wp('15%'),height:wp('15%'),
                  borderRadius:wp('10%')}}>
               
                <TouchableOpacity style={{justifyContent:'center', width:wp('15%'),height:wp('15%'),borderRadius:wp('10%')}} onPress={()=>{setpopup(!popup);
                                   setcropType(null);
                                   setValveName(null);
                                   setValveDesc(null);}}>
                <Image style={{tintColor:'white',width:'40%',height:'40%',alignSelf:'center'}} source={require('../Images/plus.png')} />
                </TouchableOpacity>
                </Animated.View>
                </Pressable> 
        <StatusBar />
        </View>
    )
                            }
}
export default ControlPage;
const styles = StyleSheet.create({
    header:{
        height:hp('6.5%'),
        backgroundColor:'white',
        elevation:5,
        alignItems:'center',
        justifyContent:'space-between',
        flexDirection:'row',
        paddingRight:70

    },
   headtxt:{
       fontFamily:'Roboto',
       fontSize:wp('6%'),
       fontWeight:'bold',
       alignSelf:'center'
   },
   controlView:{
       backgroundColor:'white',
       width:wp('70%'),
       height: wp('70%'),
       elevation:8,
       alignSelf:'center',
       paddingVertical:10,
       paddingHorizontal:15,
       borderRadius:wp('2.5%'),
       marginVertical:5
   },
   textView:{
       flexDirection:'row',
       justifyContent:'space-between',
   },
   yesbtn:{
    backgroundColor:'#36D5F0', 
    paddingVertical:wp('2.5%'),
    paddingHorizontal:wp('7.5%'),
    marginVertical:10,
    borderRadius:wp('7%'), 
    } 

})