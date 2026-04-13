import { TouchableOpacity, StyleProp, ViewStyle, StyleSheet } from 'react-native'
import theme from '../../global/styles/theme'
import FontAwesome from '@expo/vector-icons/FontAwesome'

type ButtonNewRegisterProps = {
    activeOpacity: number
    onPressFunction
    extraStyle?: StyleProp<ViewStyle>
}

export default function ButtonNewRegister({
    onPressFunction,
    activeOpacity,
    extraStyle,
}: ButtonNewRegisterProps) {
    return (
        <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={onPressFunction}
            style={[styles.touchableOpacityStyle, extraStyle]}
        >
            <FontAwesome name="plus" size={20} color={'#fff'} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    touchableOpacityStyle: {
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 8,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.btplus,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 55,
        position: 'absolute',
        bottom: 0,
    },
})
