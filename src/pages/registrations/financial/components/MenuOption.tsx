import React from 'react'
import LottieView from 'lottie-react-native'
import { Image, ImageSourcePropType, StyleProp, ViewStyle, ImageStyle } from 'react-native'
import styled from 'styled-components/native'

interface MenuOptionProps {
    label: string
    onPress: () => void
    source: any // Para o require do JSON ou Imagem
    isLottie?: boolean
    bgColor?: string
    iconStyle?: StyleProp<ImageStyle>
    lottieSize?: number
}

const MenuOption: React.FC<MenuOptionProps> = ({
    label,
    onPress,
    source,
    isLottie = true,
    bgColor,
    iconStyle,
    lottieSize = 80,
}) => {
    return (
        <ButtonStyled onPress={onPress} style={bgColor ? { backgroundColor: bgColor } : {}}>
            <ImageContainer>
                {isLottie ? (
                    <LottieView
                        autoPlay
                        loop
                        style={{ width: lottieSize, height: lottieSize }}
                        source={source}
                    />
                ) : (
                    <Image source={source} style={[{ height: 35, width: 92 }, iconStyle]} />
                )}
            </ImageContainer>
            <Label>{label}</Label>
        </ButtonStyled>
    )
}

export default MenuOption

const ButtonStyled = styled.TouchableOpacity`
    height: 120px;
    align-items: center;
    margin: 10px 20px;
    background-color: ${(props) => props.theme.colors.menu};
    padding: 5px;
    flex-direction: column;
    border-radius: 10px;
`

const ImageContainer = styled.View`
    width: 60px;
    height: 60px;
    background-color: #fff;
    border-radius: 30px;
    align-items: center;
    justify-content: center;
`

const Label = styled.Text`
    font-size: 24px;
    flex: 1;
    align-self: center;
    color: ${(props) => props.theme.fontColors.primary};
    font-weight: bold;
    margin-top: 5px;
`
