import { StyleSheet } from "react-native";

const primaryFont = "Klee One";
const primaryBlack = "#404854";

export const textStyles = StyleSheet.create({
    textHeader: {
        fontSize: 32,
        color: primaryBlack,
        fontWeight: "bold",
        fontFamily: primaryFont,
    },
    textSubHeader: {
        fontSize: 24,
        color: primaryBlack,
        fontWeight: "semi-bold",
        fontFamily: primaryFont,
    },
    textBody: {
        fontSize: 16,
        color: primaryBlack,
        fontFamily: primaryFont,
        fontWeight: "normal",
    },
});

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F5FA",
        alignItems: "center",
        justifyContent: "center",
    },
    topContainer: {
        flex: 1,
        backgroundColor: "#F0F5FA",
        padding: "5% 5% 5% 5%",
        alignItems: "center",
    },
    horzContainer: {
        backgroundColor: "#F0F5FA",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    TextInput: {
        backgroundColor: "#F0F5FA",
        marginTop: "3%",
        marginBottom: "3%",
        textAlign: "center",
        width: "50%",
        padding: "3% 3% 3% 3%",
        borderRadius: 10,
        borderWidth: 1,
    },
    textHeader: {
        fontSize: 30,
        color: "black",
        fontWeight: "bold",
    },
    textButton: {
        margin: "5%, 5%, 5%, 5%",
        justifyContent: "center",
        alignItems: "center",
    },
    Button: {
        backgroundColor: "#9CC6EF",
        padding: "5% 5% 5% 5%",
        borderRadius: 10,
        margin: "5%, 5%, 5%, 5%",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    },
    LongButton: {
        backgroundColor: "#9CC6EF",
        padding: "5% 5% 5% 5%",
        borderRadius: 10,
        margin: "3%, 5%, 3%, 5%",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        minWidth: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    TabsButton: {
        fontSize: 20,
        borderRadius: 10,
        color: "black",
    },

    // New styles for the countdown timer
    countdownContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    countdownButton: {
        backgroundColor: "#3498db",
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    countdownButtonText: {
        color: "white",
        fontSize: 18,
    },
});
