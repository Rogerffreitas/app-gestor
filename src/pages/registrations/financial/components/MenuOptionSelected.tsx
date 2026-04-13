import React from 'react'
import LottieView from 'lottie-react-native'
import { Image, StyleProp, ImageStyle, View } from 'react-native'
import styled from 'styled-components/native'
import FontAwesome from '@expo/vector-icons/FontAwesome'

interface MenuOptionSelectedProps {
    label: string
    onPress: () => void
    source: any // Para o require do JSON ou Imagem
    isLottie?: boolean
    bgColor?: string
    iconStyle?: StyleProp<ImageStyle>
    lottieSize?: number
}

const MenuOptionSelected: React.FC<MenuOptionSelectedProps> = ({
    label,
    onPress,
    source,
    isLottie = true,
    bgColor,
    iconStyle,
    lottieSize = 80,
}) => {
    return (
        <Card onPress={onPress}>
            <ButtonContent style={bgColor ? { backgroundColor: bgColor } : {}}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '12%' }} />
                    <View style={{ width: '76%', alignItems: 'center' }}>
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
                    </View>
                    <View style={{ width: '12%' }}>
                        <ViewButtonCancel>
                            <FontAwesome name="close" size={20} color={'#fff'} />
                        </ViewButtonCancel>
                    </View>
                </View>

                <Label>{label}</Label>
            </ButtonContent>
        </Card>
    )
}

export default MenuOptionSelected

const Card = styled.TouchableOpacity`
    width: 100%;
    align-items: center;
    margin-bottom: 10px;
`

const ButtonContent = styled.View`
    height: 120px;
    width: 95%;
    align-items: center;
    background-color: ${(props) => props.theme.colors.selected};
    padding: 5px;
    flex-direction: column;
    border-radius: 10px;
`

const ButtonStyled = styled.TouchableOpacity`
    height: 120px;
    width: 90%;
    align-items: center;
    background-color: ${(props) => props.theme.colors.selected};
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
const ViewButtonCancel = styled.View`
    height: 35px;
    margin: 5px;
    width: 35px;
    margin-right: 10px;
    background-color: red;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    border-color: #fff;
    border-width: 2px;
`
