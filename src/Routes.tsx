import { View, ActivityIndicator } from 'react-native'
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useAuth } from './contexts/AuthContext'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useTheme } from 'styled-components'
import { ScreenNames, ScreenTitles, UserRoles } from './types'

import Home from './pages/home'
import Login from './pages/login'
import Welcome from './pages/welcome'
import Configuracao from './pages/settings'
import Perfil from './pages/profile'
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

import Deposits from './pages/registrations/deposit'
import Deposit from './pages/registrations/deposit/new'
import EditDeposit from './pages/registrations/deposit/edit'

import Usuarios from './pages/registrations/users'

import Works from './pages/registrations/works'
import Work from './pages/registrations/works/new'
import EditWork from './pages/registrations/works/edit'

import FuelSupples from './pages/notes/fuel-supply'
import FuelSupplyList from './pages/notes/fuel-supply/list'
import EditFuelSupply from './pages/notes/fuel-supply/edit'
import NewFuelSupply from './pages/notes/fuel-supply/new'

import MaintenanceTruckFuelSupplies from './pages/notes/maintenance-truck-fuel-tank/fuel-supples'
import MaintenanceTruckFuelTank from './pages/notes/maintenance-truck-fuel-tank'

import Discounts from './pages/notes/discount'
import DiscountsList from './pages/notes/discount/list'
import EditDiscount from './pages/notes/discount/edit'
import NewDiscount from './pages/notes/discount/new'

import HourMeterMonitoring from './pages/notes/hour-meter-monitoring'
import HourMeterMonitoringList from './pages/notes/hour-meter-monitoring/list'
import NewHourMeterMonitoring from './pages/notes/hour-meter-monitoring/new'
import EditHourMeterMonitoring from './pages/notes/hour-meter-monitoring/edit'

import MaintenanceTruckRefuelTank from './pages/notes/maintenance-truck-fuel-tank/refuel-tank'
import NewMaintenanceTruckRefuelSupply from './pages/notes/maintenance-truck-fuel-tank/refuel-tank/new'
import NewMaintenanceTruckFuelSupply from './pages/notes/maintenance-truck-fuel-tank/fuel-supples/new'

import Financial from './pages/registrations/financial'
import GenerateInvoice from './pages/registrations/financial/ generate-invoice'
import NewInvoice from './pages/registrations/financial/ generate-invoice/new'
import ManageInvoice from './pages/registrations/financial/manage-invoice'
import InvoiceDetails from './pages/registrations/financial/manage-invoice/invoice-details'

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
                tabBarActiveBackgroundColor: theme.colors.secondary,
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
            {user.role === UserRoles.ADMIN ? (
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
    console.log('signed: ' + signed)
    const theme = useTheme()

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#FFFFF',
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
                    <Stack.Screen name={ScreenNames.NOTES} component={Notes} />
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
                    <Stack.Screen
                        name={ScreenNames.FUEL_SUPPLIES}
                        component={FuelSupples}
                        options={{ title: ScreenTitles.FUEL_SUPPLIES }}
                    />
                    <Stack.Screen
                        name={ScreenNames.FUEL_SUPPLY_LIST}
                        component={FuelSupplyList}
                        options={{ title: ScreenTitles.FUEL_SUPPLY_LIST }}
                    />
                    <Stack.Screen
                        name={ScreenNames.EDIT_FUEL_SUPPLY}
                        component={EditFuelSupply}
                        options={{ title: ScreenTitles.EDIT_FUEL_SUPPLY }}
                    />
                    <Stack.Screen
                        name={ScreenNames.NEW_FUEL_SUPPLY}
                        component={NewFuelSupply}
                        options={{ title: ScreenTitles.NEW_FUEL_SUPPLY }}
                    />
                    <Stack.Screen
                        name={ScreenNames.MAINTENANCE_TRUCK_FUEL_TANK}
                        component={MaintenanceTruckFuelTank}
                        options={{ title: ScreenTitles.MAINTENANCE_TRUCK_FUEL_TANK }}
                    />
                    <Stack.Screen
                        name={ScreenNames.MAINTENANCE_TRUCK_FUEL_SUPPLIES}
                        component={MaintenanceTruckFuelSupplies}
                        options={{ title: ScreenTitles.MAINTENANCE_TRUCK_FUEL_SUPPLIES }}
                    />

                    <Stack.Screen
                        name={ScreenNames.NEW_MAINTENANCE_TRUCK_FUEL_SUPPLY}
                        component={NewMaintenanceTruckFuelSupply}
                        options={{ title: ScreenTitles.NEW_MAINTENANCE_TRUCK_FUEL_SUPPLY }}
                    />
                    <Stack.Screen
                        name={ScreenNames.MAINTENANCE_TRUCK_REFUEL_TANK}
                        component={MaintenanceTruckRefuelTank}
                        options={{ title: ScreenTitles.MAINTENANCE_TRUCK_REFUEL_TANK }}
                    />
                    <Stack.Screen
                        name={ScreenNames.NEW_MAINTENANCE_TRUCK_REFUEL_SUPPLY}
                        component={NewMaintenanceTruckRefuelSupply}
                        options={{ title: ScreenTitles.NEW_MAINTENANCE_TRUCK_REFUEL_SUPPLY }}
                    />
                    <Stack.Screen
                        name={ScreenNames.DISCOUNTS}
                        component={Discounts}
                        options={{ title: ScreenTitles.DISCOUNTS }}
                    />
                    <Stack.Screen
                        name={ScreenNames.DISCOUNTS_LIST}
                        component={DiscountsList}
                        options={{ title: ScreenTitles.DISCOUNTS_LIST }}
                    />
                    <Stack.Screen
                        name={ScreenNames.NEW_DISCOUNTS}
                        component={NewDiscount}
                        options={{ title: ScreenTitles.NEW_DISCOUNT }}
                    />
                    <Stack.Screen
                        name={ScreenNames.EDIT_DISCOUNTS}
                        component={EditDiscount}
                        options={{ title: ScreenTitles.EDIT_DISCOUNT }}
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
                    <Stack.Screen
                        name={ScreenNames.HOUR_METER_MONITORINGS}
                        component={HourMeterMonitoring}
                        options={{ title: ScreenTitles.HOUR_METER_MONITORINGS }}
                    />
                    <Stack.Screen
                        name={ScreenNames.HOUR_METER_MONITORINGS_LIST}
                        component={HourMeterMonitoringList}
                        options={{ title: ScreenTitles.HOUR_METER_MONITORINGS_LIST }}
                    />
                    <Stack.Screen
                        name={ScreenNames.EDIT_HOUR_METER_MONITORING}
                        component={EditHourMeterMonitoring}
                        options={{ title: ScreenTitles.EDIT_HOUR_METER_MONITORING }}
                    />
                    <Stack.Screen
                        name={ScreenNames.NEW_HOUR_METER_MONITORING}
                        component={NewHourMeterMonitoring}
                        options={{ title: ScreenTitles.NEW_HOUR_METER_MONITORING }}
                    />
                    <Stack.Screen
                        name={ScreenNames.WORKS}
                        component={Works}
                        options={{ title: ScreenTitles.WORKS }}
                    />
                    <Stack.Screen
                        name={ScreenNames.NEW_WORK}
                        component={Work}
                        options={{ title: ScreenTitles.NEW_WORK }}
                    />
                    <Stack.Screen
                        name={ScreenNames.EDIT_WORK}
                        component={EditWork}
                        options={{ title: ScreenTitles.EDIT_WORK }}
                    />
                    <Stack.Screen
                        name={ScreenNames.WORK_ROUTES}
                        component={WorkRoutes}
                        options={{ title: ScreenTitles.WORK_ROUTES }}
                    />

                    <Stack.Screen
                        name={ScreenNames.NEW_WORK_ROUTE}
                        options={{ title: ScreenTitles.NEW_WORK_ROUTE }}
                        component={Route}
                    />
                    <Stack.Screen
                        name={ScreenNames.EDIT_WORK_ROUTE}
                        options={{ title: ScreenTitles.EDIT_WORK_ROUTE }}
                        component={EditRoute}
                    />
                    <Stack.Screen name="Usuarios" component={Usuarios} />

                    <Stack.Screen
                        name={ScreenNames.MATERIALS}
                        options={{ title: ScreenTitles.MATERIALS }}
                        component={Materials}
                    />
                    <Stack.Screen
                        name={ScreenNames.NEW_MATERIAL}
                        options={{ title: ScreenTitles.NEW_MATERIAL }}
                        component={Material}
                    />
                    <Stack.Screen
                        name={ScreenNames.EDIT_MATERIAL}
                        options={{ title: ScreenTitles.EDIT_MATERIAL }}
                        component={EditarMaterial}
                    />
                    <Stack.Screen
                        name={ScreenNames.DEPOSITS}
                        component={Deposits}
                        options={{ title: ScreenTitles.DEPOSITS }}
                    />

                    <Stack.Screen
                        name={ScreenNames.NEW_DEPOSIT}
                        options={{ title: ScreenTitles.NEW_DEPOSIT }}
                        component={Deposit}
                    />
                    <Stack.Screen
                        name={ScreenNames.EDIT_DEPOSIT}
                        options={{ title: ScreenTitles.EDIT_DISCOUNT }}
                        component={EditDeposit}
                    />
                    <Stack.Screen name={ScreenNames.EQUIPMENT} component={EquipmentMenuOptions} />
                    <Stack.Screen
                        name={ScreenNames.EQUIPMENTS}
                        options={{ title: ScreenTitles.EQUIPMENTS }}
                        component={Equipments}
                    />
                    <Stack.Screen
                        name={ScreenNames.NEW_EQUIPMENT}
                        options={{ title: ScreenTitles.NEW_EQUIPMENT }}
                        component={NewEquipment}
                    />
                    <Stack.Screen
                        name={ScreenNames.EDIT_EQUIPMENT}
                        options={{ title: ScreenTitles.EDIT_EQUIPMENT }}
                        component={EditEquipment}
                    />
                    <Stack.Screen
                        name={ScreenNames.BANK_INFO_EQUIPMENT}
                        options={{ title: ScreenTitles.BANK_INFO_EQUIPMENT }}
                        component={BankInfo}
                    />
                    <Stack.Screen
                        name={ScreenNames.WORK_EQUIPMENTS}
                        options={{ title: ScreenTitles.WORK_EQUIPMENTS }}
                        component={WorkEquipment}
                    />
                    <Stack.Screen
                        name={ScreenNames.WORK_EQUIPMENTS_LIST}
                        options={{ title: ScreenTitles.WORK_EQUIPMENTS_LIST }}
                        component={WorkEquipmentList}
                    />
                    <Stack.Screen
                        name={ScreenNames.MAINTENANCE_TRUCKS}
                        component={MaintenanceTrucks}
                        options={{ title: ScreenTitles.MAINTENANCE_TRUCKS }}
                    />

                    <Stack.Screen
                        name={ScreenNames.NEW_MAINTENANCE_TRUCKS}
                        component={NewMaintenanceTruck}
                        options={{ title: ScreenTitles.NEW_MAINTENANCE_TRUCKS }}
                    />
                    <Stack.Screen name="Edit Maintenance Trucks" component={EditMaintenanceTruck} />

                    <Stack.Screen
                        name={ScreenNames.FINANCIAL}
                        component={Financial}
                        options={{ title: ScreenTitles.FINANCIAL }}
                    />
                    <Stack.Screen
                        name={ScreenNames.GENERATE_INVOICE}
                        component={GenerateInvoice}
                        options={{ title: ScreenTitles.GENERATE_INVOICE }}
                    />
                    <Stack.Screen
                        name={ScreenNames.NEW_INVOICE}
                        component={NewInvoice}
                        options={{ title: ScreenTitles.NEW_INVOICE }}
                    />

                    <Stack.Screen
                        name={ScreenNames.MANAGE_INVOICE}
                        component={ManageInvoice}
                        options={{ title: ScreenTitles.MANAGE_INVOICE }}
                    />
                    <Stack.Screen
                        name={ScreenNames.INVOICE_DETAILS}
                        component={InvoiceDetails}
                        options={{ title: ScreenTitles.INVOICE_DETAILS }}
                    />
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
