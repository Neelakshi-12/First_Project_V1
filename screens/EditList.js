import React , { useLayoutEffect , useState} from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    FlatList
} from "react-native";
import { CommonActions } from "@react-navigation/native";

export default ({navigation,route}) => {
    const [title, setTitle] =  useState(route.params.title || "");
    const [isValid, setValidity] = useState(true);

    return(
        <View style={styles.container}>
            <View>
                <View >
                <Text style={styles.label}>List Name</Text>
                {!isValid && (
                        <Text
                            style={{
                                marginLeft: 4,
                                color: "red",
                                fontSize: 12,
                                textAlign : "center",
                            }}
                        >
                            * List Name cannot be empty
                        </Text>
                    )}
                <TextInput
                    underlineColorAndroid={"transparent"}
                    selectionColor={"transparent"}
                    autoFocus={true}
                    value={title}
                    onChangeText={(text) => {
                        setTitle(text);
                        setValidity(true);
                    }}
                    placeholder={"New List Name"}
                    maxLength={30}
                    style={[styles.input]}
                />
            </View>
        </View>
            <TouchableOpacity style={styles.saveButton} onPress={()=> {
                if (title.length > 1) {
                    route.params.saveChanges({ title });
                    navigation.dispatch(CommonActions.goBack());
                } else {
                    setValidity(false);
                }
            }}>
              <Text style={{color:"white", fontSize:20, fontWeight : "bold"}}>
                  Save
              </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#808080",
        padding: 5,
        justifyContent: "space-between",
    },
    input: {
        color: "#000",
        borderBottomColor:"#000",
        borderBottomWidth: 0.5,
        marginHorizontal: 5,
        padding: 3,
        height: 40,
        fontSize: 24,
        textAlign : "center",
    },
    saveButton: {
        borderRadius: 25,
        backgroundColor:"#000",
        height: 48,
        margin: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    label: {
        color: "#000",
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 8,
        marginTop:8,
        marginLeft:10,
        textAlign : "center",
        
    },
});