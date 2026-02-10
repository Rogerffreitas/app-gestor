import React from 'react'
import { StyleSheet } from 'react-native'
import { TextInputMask } from 'react-native-masked-text'

export default function InputMaskMoney({
    onChangeTextFunction,
    placeholder,
    autoCapitalize,
    autoCorrect,
    secureTextEntry,
    autoFocus,
    keyboardType,
    value,
}) {
    return (
        <TextInputMask
            type={'money'}
            options={{
                precision: 2,
                separator: ',',
                delimiter: '.',
                unit: 'R$ ',
                suffixUnit: '',
            }}
            onChangeText={(text) => {
                onChangeTextFunction(text)
            }}
            value={value}
            autoCapitalize={autoCapitalize}
            placeholderTextColor="#00000040"
            autoCorrect={autoCorrect}
            secureTextEntry={secureTextEntry}
            placeholder={placeholder}
            autoFocus={autoFocus}
            keyboardType={keyboardType}
            style={styles.input}
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
