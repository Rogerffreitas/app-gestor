import { DefaultTheme } from 'styled-components/native'

declare module 'styled-components/native' {
    export interface DefaultTheme {
        colors: {
            btplus: string
            primary: string
            primarySelect: string
            menu: string
            secondary: string
            backgroundcolor: string
            selected: string
        }
        fontColors: {
            primary: string
        }

        fonts: {
            regular: string
            medium: string
            bold: string
        }
    }
}

export const theme: DefaultTheme = {
    colors: {
        btplus: '#ff0000',
        primary: '#009999',
        primarySelect: '#00008080',
        menu: '#000080',
        secondary: '#008099',
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

export default theme
