import React from 'react';
import { Text, View,} from 'react-native';

//import styles from './style';

export default function Detalhes({ route }) {
	return(
		<View>
			<Text>Placa: {route.params?.placa}</Text>
			<Text>Data: {route.params?.data}</Text>
		</View>
	);

}