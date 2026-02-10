import { DefaultTheme } from 'styled-components/native'

export default {
    colors: {
        btplus: '#ff0000',
        primary: '#009999',
        primarySelect: '#00008080',
        menu: '#000080',
        secondery: '#008099',
        backgroundcolor: '#75757520',
        selected: '#ef6c00',
    },

    fontColors: {
        primary: '#fff',
    },

    fonts: {
        regular: 'Poppins_400Regular',
        medium: 'Poppins_500Medium',
        bold: 'Poppins_700Bold',
    },
}

export const lightTheme: DefaultTheme = {
    backgroundColor: '#FFFFFF',
    primary: '#512DA8',
    text: '#121212',
    error: '#D32F2F',
}

export const darkTheme: DefaultTheme = {
    backgroundColor: '#121212',
    primary: '#B39DDB',
    text: '#FFFFFF',
    error: '#EF9A9A',
}
