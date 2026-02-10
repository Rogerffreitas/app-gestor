import { View, ActivityIndicator } from 'react-native'
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useAuth } from './contexts/AuthContext'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Home from './pages/home'
import Login from './pages/login'
import Welcome from './pages/welcome'
import Configuracao from './pages/Configuracao'
import Perfil from './pages/Perfil'
import ButtonTab from './components/button/ButtonTab'

import TransportNote from './pages/notes/transport'
import TransportNoteList from './pages/notes/transport/list'
import NewTransportNote from './pages/notes/transport/new'
import TransportDetails from './pages/notes/transport/details'

import Notes from './pages/notes'
import Cadastros from './pages/registrations'

import TransportVehicles from './pages/registrations/transport-vehicle'
import EditTransportVehicle from './pages/registrations/transport-vehicle/edit'
import NewTransportVehicle from './pages/registrations/transport-vehicle/new'
import BankInfoTransportVehicle from './pages/registrations/transport-vehicle/bank-info'

import WorkRoutes from './pages/registrations/work-routes'
import Route from './pages/registrations/work-routes/new'
import EditRoute from './pages/registrations/work-routes/edit'

import Materials from './pages/registrations/material'
import Material from './pages/registrations/material/new'
import EditarMaterial from './pages/registrations/material/edit'

import Equipments from './pages/registrations/equipment/list'
import EquipmentMenuOptions from './pages/registrations/equipment'
import EditEquipment from './pages/registrations/equipment/edit'
import NewEquipment from './pages/registrations/equipment/new'
import BankInfo from './pages/registrations/equipment/bankinfo'
import WorkEquipment from './pages/registrations/equipment/work-equipment/new'
import WorkEquipmentList from './pages/registrations/equipment/work-equipment'

import MaintenanceTrucks from './pages/registrations/equipment/maintenance-trucks'
import EditMaintenanceTruck from './pages/registrations/equipment/maintenance-trucks/edit'
import NewMaintenanceTruck from './pages/registrations/equipment/maintenance-trucks/new'
import MaintenancetrucksList from './pages/registrations/equipment/maintenance-trucks/list'

import Deposits from './pages/registrations/deposit'
import Deposit from './pages/registrations/deposit/new'
import EditDeposit from './pages/registrations/deposit/edit'

import Usuarios from './pages/registrations/users'

import Works from './pages/registrations/works'
import Work from './pages/registrations/works/new'
import EditWork from './pages/registrations/works/edit'

import { useTheme } from 'styled-components'
import { ScreenNames, ScreenTitles } from './types'
import { WorkServicesImpl } from './domin/services/impl/WorkServicesImpl'
import { WorkWatermelonDbRepository } from './persistence/WorkWatermelonDbRepository'
import { AxiosHttpClientAdapter } from './infra/adapter/AxiosHttpClientAdapter'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const configOpen = {
    animation: 'spring',
    config: {
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
    },
}

const configClose = {
    animation: 'spring',
    config: {
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
    },
}

function LogOutButton() {
    return null
}

function Tabs() {
    const { signOut, user } = useAuth()
    const theme = useTheme()
    const boasVindas = 'Usuário: ' + user?.name
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarInactiveBackgroundColor: theme.colors.primary,
                tabBarActiveBackgroundColor: theme.colors.secondery,
                tabBarInactiveTintColor: '#fff',
                tabBarActiveTintColor: '#fff',
                tabBarIconStyle: { marginTop: 4 },
                tabBarLabelStyle: {
                    fontSize: 13,
                    color: '#fff',
                    paddingBottom: 3,
                },
                tabBarStyle: {
                    height: 100,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 4,
                    borderTopWidth: 0,
                },
                headerStyle: {
                    backgroundColor: theme.colors.primary,
                    borderTopRightRadius: 15,
                    borderTopLeftRadius: 15,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerBackgroundContainerStyle: {
                    backgroundColor: '#000',
                },
            }}
        >
            <Tab.Screen
                name={'Home'}
                component={Home}
                options={{
                    headerShown: false,
                    title: boasVindas,
                    headerTitleStyle: { fontSize: 13 },
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="home" color={color} size={29} style={{ marginTop: 1 }} />
                    ),
                }}
            />
            <Tab.Screen
                name="Perfil"
                component={Perfil}
                options={{
                    tabBarLabel: 'Perfil',
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="account-box" color={color} size={29} style={{ marginTop: 1 }} />
                    ),
                }}
            />
            {user.role === 'admin' ? (
                <Tab.Screen
                    name="Configuracao"
                    component={Configuracao}
                    options={{
                        title: 'Configurações',
                        tabBarLabel: 'Configurações',
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons name="settings" color={color} size={29} style={{ marginTop: 1 }} />
                        ),
                    }}
                />
            ) : null}
            <Tab.Screen
                name="Sair"
                component={LogOutButton}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ color }) => <ButtonTab color={color} onPressFunction={signOut} />,
                }}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault()
                    },
                }}
            />
        </Tab.Navigator>
    )
}

export default function App() {
    const { signed, loading, firstAccess } = useAuth()
    const theme = useTheme()

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ActivityIndicator size="large" color="#666" />
            </View>
        )
    }

    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.fontColors.primary,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },

                //gestureEnabled: true,
                //gestureDirection: 'horizontal',
                cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
                transitionSpec: {
                    open: {
                        animation: 'spring',
                        config: {
                            stiffness: 1000,
                            damping: 500,
                            mass: 3,
                            overshootClamping: true,
                            restDisplacementThreshold: 0.01,
                            restSpeedThreshold: 0.01,
                        },
                    },
                    close: {
                        animation: 'spring',
                        config: {
                            stiffness: 1000,
                            damping: 500,
                            mass: 3,
                            overshootClamping: true,
                            restDisplacementThreshold: 0.01,
                            restSpeedThreshold: 0.01,
                        },
                    },
                },
            }}
        >
            {firstAccess ? (
                <>
                    <Stack.Screen
                        name={ScreenNames.welcome}
                        component={Welcome}
                        options={{ headerShown: false, animationEnabled: false }}
                    />
                </>
            ) : signed ? (
                <>
                    <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
                    <Stack.Screen
                        name={ScreenNames.NOTES}
                        component={Notes}
                        initialParams={{
                            workServices: new WorkServicesImpl(
                                new WorkWatermelonDbRepository(),
                                new AxiosHttpClientAdapter()
                            ),
                        }}
                    />

                    <Stack.Screen
                        name={ScreenNames.TRANSPORT_NOTE}
                        component={TransportNote}
                        options={{ title: ScreenTitles.TRANSPORT_NOTE }}
                    />
                    <Stack.Screen
                        name={ScreenNames.TRANSPORT_NOTE_LIST}
                        component={TransportNoteList}
                        options={{ title: ScreenTitles.TRANSPORT_NOTE_LIST }}
                    />
                    <Stack.Screen
                        name={ScreenNames.NEW_TRANSPORT_NOTE}
                        component={NewTransportNote}
                        options={{ title: ScreenTitles.NEW_TRANSPORT_NOTE }}
                    />
                    <Stack.Screen
                        name={ScreenNames.TRANSPORT_DETAILS}
                        component={TransportDetails}
                        options={{ title: ScreenTitles.TRANSPORT_DETAILS }}
                    />

                    <Stack.Screen name="Cadastros" component={Cadastros} />
                    <Stack.Screen name="Perfil" component={Perfil} />
                    <Stack.Screen
                        name="Configuracao"
                        component={Configuracao}
                        options={{ title: 'Configurações' }}
                    />
                    <Stack.Screen
                        name={ScreenNames.TRANSPORT_VEHICLES}
                        component={TransportVehicles}
                        options={{ title: ScreenTitles.TRANSPORT_VEHICLES }}
                    />
                    <Stack.Screen
                        name={ScreenNames.NEW_TRANSPORT_VEHICLE}
                        component={NewTransportVehicle}
                        options={{ title: ScreenTitles.NEW_TRANSPORT_VEHICLE }}
                    />
                    <Stack.Screen
                        name={ScreenNames.EDIT_TRANSPORT_VEHICLE}
                        component={EditTransportVehicle}
                        options={{ title: ScreenTitles.EDIT_TRANSPORT_VEHICLE }}
                    />
                    <Stack.Screen
                        name={ScreenNames.BANK_INFO_TRANSPORT_VEHICLE}
                        component={BankInfoTransportVehicle}
                        options={{ title: ScreenTitles.BANK_INFO_TRANSPORT_VEHICLE }}
                    />

                    <Stack.Screen name="Works" component={Works} options={{ title: 'Obras' }} />
                    <Stack.Screen name="New Work" component={Work} options={{ title: 'Nova Obra' }} />
                    <Stack.Screen name="Edit Work" component={EditWork} options={{ title: 'Editar Obra' }} />

                    <Stack.Screen name="Work Routes" options={{ title: 'Rotas' }} component={WorkRoutes} />
                    <Stack.Screen name="New Route" options={{ title: 'Cadastrar rota' }} component={Route} />
                    <Stack.Screen
                        name="Edit Route"
                        options={{ title: 'Editar Rota' }}
                        component={EditRoute}
                    />

                    <Stack.Screen name="Usuarios" component={Usuarios} />
                    <Stack.Screen
                        name="Deposits"
                        component={Deposits}
                        options={{ title: 'Escolha uma Jazida' }}
                    />
                    <Stack.Screen name="Materials" options={{ title: 'Materiais' }} component={Materials} />
                    <Stack.Screen name="New Material" options={{ title: 'Materiais' }} component={Material} />
                    <Stack.Screen
                        name="Edit Material"
                        options={{ title: 'Editar Material' }}
                        component={EditarMaterial}
                    />

                    <Stack.Screen name="New Deposit" options={{ title: 'Nova Jazida' }} component={Deposit} />
                    <Stack.Screen
                        name="Edit Deposit"
                        options={{ title: 'Editar Jazida' }}
                        component={EditDeposit}
                    />

                    <Stack.Screen name="Equipment" component={EquipmentMenuOptions} />
                    <Stack.Screen
                        name="Equipments"
                        options={{ title: 'Equipamentos' }}
                        component={Equipments}
                    />
                    <Stack.Screen
                        name="New Equipment"
                        options={{ title: 'Equipamentos' }}
                        component={NewEquipment}
                    />
                    <Stack.Screen name="Edit Equipment" options={{ title: '' }} component={EditEquipment} />
                    <Stack.Screen
                        name="Bank info Equipment"
                        options={{ title: 'Dados Bancários' }}
                        component={BankInfo}
                    />
                    <Stack.Screen
                        name="Work Equipment"
                        options={{ title: ScreenTitles.WORK_EQUIPMENTS }}
                        component={WorkEquipment}
                    />

                    <Stack.Screen
                        name="Work Equipment List"
                        options={{ title: ScreenTitles.WORK_EQUIPMENTS_LIST }}
                        component={WorkEquipmentList}
                    />

                    <Stack.Screen
                        name="Maintenance trucks"
                        component={MaintenanceTrucks}
                        options={{ title: ScreenTitles.MAINTENANCE_TRUCKS }}
                    />
                    <Stack.Screen
                        name="Maintenance trucks List"
                        component={MaintenancetrucksList}
                        options={{ title: ScreenTitles.MAINTENANCE_TRUCKS_LIST }}
                    />
                    <Stack.Screen
                        name="New Maintenance Trucks"
                        component={NewMaintenanceTruck}
                        options={{ title: 'Cadastrar uma melosa' }}
                    />
                    <Stack.Screen name="Edit Maintenance Trucks" component={EditMaintenanceTruck} />
                </>
            ) : (
                <>
                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={{ headerShown: false, animationEnabled: false }}
                    />
                </>
            )}
        </Stack.Navigator>
    )
}
