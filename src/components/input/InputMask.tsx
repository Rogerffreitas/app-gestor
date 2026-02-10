import React from 'react'
import { StyleSheet } from 'react-native'
import { TextInputMask } from 'react-native-masked-text'

export default function InputMask({
    type,
    mask,
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
            type={type}
            options={{
                /**
                 * mask: (String | required | default '')
                 * the mask pattern
                 * 9 - accept digit.
                 * A - accept alpha.
                 * S - accept alphanumeric.
                 * * - accept all, EXCEPT white space.
                 */
                mask,
            }}
            onChangeText={(text) => {
                onChangeTextFunction(text)
            }}
            autoCapitalize={autoCapitalize}
            placeholderTextColor="#00000040"
            autoCorrect={autoCorrect}
            secureTextEntry={secureTextEntry}
            placeholder={placeholder}
            autoFocus={autoFocus}
            keyboardType={keyboardType}
            style={styles.input}
            value={value}
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
