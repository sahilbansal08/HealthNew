import React from 'react'
import { Text, TouchableOpacity } from 'react-native';

const Chip = ({ title = 'Chip', isClicked = false, onPress }) => {
    return (
        <TouchableOpacity style={{ borderWidth: 1, borderColor: 'grey', height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: isClicked ? "blue" : "white", paddingVertical: 2, paddingHorizontal: 5 }} onPress={onPress}>
            <Text style={{ fontWeight: 700, color: isClicked ? "white" : 'black' }}>{title}</Text>
        </TouchableOpacity>
    )
}

export default Chip;