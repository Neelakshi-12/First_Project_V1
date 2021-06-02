import React , { useLayoutEffect , useState} from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    AsyncStorage,
    Alert,
} from "react-native";
import {auth , firestore} from "firebase";
import { useEffect } from "react";

const ListButton = ({title,navigation , onOptions, onDelete}) => {
    return(
            <TouchableOpacity onPress={() => {}} style={styles.itemContainer}>
                <View><Text style={styles.itemTitle}>{title}</Text></View>
                <View style={{flexDirection:"row"}}>
                <TouchableOpacity onPress={onOptions}>
                    <Text style={styles.editbutton}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onDelete}>
                    <Text style={styles.delbutton}>Delete</Text>
                </TouchableOpacity>
                </View>
            </TouchableOpacity>
    );
}
const renderAddListIcon = (navigation , addItemToLists) => {
  return(
    <View style={{ flexDirection: "row" }}>
    <TouchableOpacity
        style={{ justifyContent: "center", marginRight: 4 }}
        onPress={() => navigation.navigate("Settings")}
    >
        <Text style={styles.more}>MORE</Text>
    </TouchableOpacity>
      <TouchableOpacity onPress={()=>navigation.navigate("Edit", {saveChanges :addItemToLists})}>
       <Text style={styles.icon}>+</Text>
      </TouchableOpacity>
       </View>
  );
};
export default({navigation}) => {
    const [lists,setLists] = useState([]);
    // useEffect(() => {
    //     firestore().collection('Todos')
    //     .where("Userid " , "==" , auth().currentUser.uid)
    //     .onSnapshot((querySnapshot) => {
    //         let todosList= [];
    //         querySnapshot.forEach((doc) => {
    //             todoList.push({...doc.data(), id: doc.id});
    //         });
    //         setLists(todosList);
    //         console.log(lists);
    //     });
    // }, []);    
   

    const addItemToLists =async (item) => {     // C = create operation || add task
        console.log(item);
        console.log("savebtn");
        const uid = auth().currentUser.uid
        let tid=0;
        try{
             tid=parseInt(await AsyncStorage.getItem('taskid'),10)
        }catch(e){
            console.log("error",e.message);
        }
        if(tid>=0){
         
        }else{
            tid=0; 
        }
        console.log("tid",tid);

         firestore().collection('Todos')
                .add({
                    Userid : uid,
                    taskid :tid,
                    task:item['title'],
                    isCompleted : "false",
                    createdDate:new Date()
                }).then((res)=>{
                    console.log("success")
                }).catch(e=>{
                    console.log("error",e);
                })
                AsyncStorage.setItem('taskid',(tid+1).toString())
        //     lists.push(item);
        // setLists([...lists]); //spread Operator
        Alert.alert("Task Added!");
    }

    
    const removeItemFromLists = async (index) => {       //Delete operation || Delete task
       await firestore().collection("Todos")
        .doc(await AsyncStorage.getItem('taskid'+ index))
        .delete()
        .then(() => {
            console.log("Deleted!");
         //    Toast.show('Updated!!');
        })

    }
    

    useLayoutEffect(() =>{
    navigation.setOptions({
        headerRight :()=> renderAddListIcon(navigation , addItemToLists)
    })
    })


    useEffect(() => {                                  // Read Operation 
        firestore().collection('Todos')
        .where("Userid","==",auth().currentUser.uid)
        .onSnapshot((querySnapshot)=>{
           let todoList=[];
           querySnapshot.forEach((doc)=>{
                 todoList.push({...doc.data(), id: doc.id});
                 AsyncStorage.setItem('taskid'+doc.data().taskid, doc.id)    //update

           })
           setLists(todoList);
           //console.log(lists);

        })
   }
   );
    return(
        <View style={styles.container}>
            <FlatList 
            
            data={lists}
            renderItem={({item})=> {
               return(
                 <ListButton title={item.task}
                    navigation={navigation}
                    onDelete={() => removeItemFromLists(item.taskid)}
                    onOptions={() => {
                        navigation.navigate("Edit", {task : item.task , taskid : item.taskid});
                    }}
                    />
               );
            }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#808080",
        
    },
    itemTitle: { 
        fontSize: 24, 
        padding: 5, 
        color: "white", 
        
    },
    itemContainer: {
        
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 100,
        flex: 1,
        borderRadius: 20,
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 15,
        backgroundColor: "#000",
    },
    icon: {
        padding: 5,
        fontSize: 28,
        color : "#fff",
        fontWeight : "bold",
        
    },
    centeredView: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    delbutton:{
        backgroundColor: "red",  
        borderRadius: 10,
        color:"white",
        padding: 8,
        marginHorizontal: 5,
    },
    editbutton:{
        backgroundColor: "green",  
        borderRadius: 10,
        color:"white",
        padding: 8,
        marginHorizontal: 5,
    },
    more:{
        backgroundColor: "darkblue",  
        borderRadius: 10,
        color:"white",
        padding: 5,
        marginHorizontal: 5,
    }
});