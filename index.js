import { registerRootComponent } from 'expo'

import App from './App'

registerRootComponent(App)

if (Text.defaultProps == null) {
    Text.defaultProps = {}
    Text.defaultProps.allowFontScaling = false
}
