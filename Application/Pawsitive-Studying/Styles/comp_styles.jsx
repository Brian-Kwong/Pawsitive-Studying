import { StyleSheet } from 'react-native'

const primaryFont = 'Klee One'
const primaryBlack = '#404854'

export const textStyles = StyleSheet.create({
    textHeader: {
        fontSize: 32,
        color: primaryBlack,
        fontWeight: 'bold',
        fontFamily: primaryFont,
    },
    textSubHeader: {
        fontSize: 24,
        color: primaryBlack,
        fontWeight: 'semi-bold',
        fontFamily: primaryFont,
    },
    textBody: {
        fontSize: 16,
        color: primaryBlack,
        fontFamily: primaryFont,
        fontWeight: 'normal',
    },
})

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F5FA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    TextInput: {
        backgroundColor: '#F0F5FA',
        marginTop: '5%',
        marginBottom: '5%',
        paddingVertical: '1%',
        textAlign: 'center',
        borderRadius: 10,
        borderWidth: 1,
    },
    textHeader: {
        fontSize: 30,
        color: 'black',
        fontWeight: 'bold',
    },
    Button: {
        backgroundColor: '#FFD700',
        padding: '5% 5% 5% 5%',
        borderRadius: 10,
    },
    TabsButton: {
        fontSize: 20,
        borderRadius: 10,
        color: 'black',
    },

    // New styles for the countdown timer
    countdownContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    countdownButton: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    countdownButtonText: {
        color: 'white',
        fontSize: 18,
    },
})
