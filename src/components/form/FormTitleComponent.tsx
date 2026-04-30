import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import theme from '../../global/styles/theme'

type FormTitleComponentProps = {
    children?: React.ReactNode | undefined
    nomeForm: string
}

export default function FormTitleComponent(props: FormTitleComponentProps) {
    return (
        <View style={styles.card}>
            <View style={styles.cardTitle}>
                <Text style={styles.cardText}>{props.nomeForm}</Text>
            </View>
            {props.children}
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        padding: 15,
        marginBottom: 30,
        width: '90%',
        alignItems: 'center',
    },
    cardTitle: {
        backgroundColor: theme.colors.menu,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        padding: 10,
        marginTop: 0,
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
    },
    cardText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
})
