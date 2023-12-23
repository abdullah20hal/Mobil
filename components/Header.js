import { View ,Text } from "react-native";
import React from "react";

const Header = (props) =>{
    return(
        <View style={{marginRight:40}}>
            <Text style={{fontWeight:'bold',fontSize:18}}>
                {props.name}
            </Text>
        </View>
    )
}
export default Header