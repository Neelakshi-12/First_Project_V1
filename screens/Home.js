import React , { useLayoutEffect , useState , useEffect} from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList
} from "react-native";
import {
    onSnapshot,
    addDoc,
    removeDoc,
    updateDoc,
} from "../services/collections";
import {auth , firestore} from "firebase";

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
    const [lists, setLists] = useState([]);
    const listsRef = firestore()
        .collection("users")
        .doc(auth().currentUser.uid)
        .collection("lists");

    useEffect(() => {
        onSnapshot(
            listsRef,
            (newLists) => {
                setLists(newLists);
            },
            {
                sort: (a, b) => {
                    if (a.index < b.index) {
                        return -1;
                    }

                    if (a.index > b.index) {
                        return 1;
                    }

                    return 0;
                },
            }
        );
    }, []);

    const addItemToLists = ({ title }) => {
        // lists.push(item);
        // setLists([...lists]); //spread Operator
        const index = lists.length > 1 ? lists[lists.length - 1].index + 1 : 0;
        addDoc(listsRef, { title, index });
    }
    
    const removeItemFromLists = (id) => {
        // // lists.splice(index,1);
        // // setLists([...lists])
        // removeDoc(listsRef, id);
    }
    
    const updateItemFromLists = (id, item) => {
        // // lists[index] = item;
        // // setLists([...lists]); 
        // updateDoc(listsRef, id, item);
    }

    useLayoutEffect(() =>{
    navigation.setOptions({
        headerRight :()=> renderAddListIcon(navigation , addItemToLists)
    })
    })
    return(
        <View style={styles.container}>
            <FlatList 
            data={lists}
            renderItem={({item :{title},index})=> {
               return(
                    <ListButton title={title}
                    navigation={navigation}
                    onDelete={() => removeItemFromLists(index)}
                    onOptions={() => {navigation.navigate("Edit",
                    {
                        title,
                        saveChanges: (item) => updateItemFromLists(index, item)
                    })
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
