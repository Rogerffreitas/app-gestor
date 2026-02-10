import React from 'react'
import { Controller } from 'react-hook-form'
import { StyleSheet, TextInput } from 'react-native'

export default function InputComponent({
    placeholder,
    autoCapitalize,
    autoCorrect,
    secureTextEntry,
    autoFocus,
    keyboardType,
    onChangeTextFunction,
}) {
    return (
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#00000040"
            onChangeText={(text) => onChangeTextFunction(text)}
            autoCapitalize={autoCapitalize}
            secureTextEntry={secureTextEntry}
            autoCorrect={autoCorrect}
            autoFocus={autoFocus}
            keyboardType={keyboardType}
        />
    )
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 0.9,
        borderColor: '#00000090',
        borderRadius: 5,
        padding: 10,
        marginVertical: 1,
        width: '100%',
        color: '#000',
    },
})
