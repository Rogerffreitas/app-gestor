import React from 'react'
import { View, StyleSheet } from 'react-native'

type FormComponentProps = {
  children?: React.ReactNode | undefined
}

export default function FormComponent(props: FormComponentProps) {
  return <View style={styles.card}>{props.children}</View>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFFFF',
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
    marginBottom: 50,
    width: '90%',
    alignItems: 'center',
  },
})
