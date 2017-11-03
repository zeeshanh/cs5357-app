import React, { Component } from 'react';
import { Button, StyleSheet, Text, TextInput, View, Alert} from 'react-native';
import { StackNavigator } from 'react-navigation';

class GetCodeScreen extends React.Component {

    static navigationOptions = {
        title: "Enter Phone Number"
    };

    render() {

        const { navigate } = this.props.navigation;

        var validatePhone = () => {
            // TODO: validate phone number
            return true;
        };

        return (
            <View style={styles.container}>
                <Text
                    style={{fontSize:30, color: "#666"}}
                >Man With A Van</Text>
                <TextInput
                    style={{height: 40, width: 200, margin:30, textAlign: 'center'}}
                    placeholder="Enter Phone Number"
                />
                <Button
                    onPress={() => validatePhone ? navigate('EnterCode') : false}
                    title="Get Code"
                    color="#00796B"
                />
            </View>
        );
    }
}

class EnterCodeScreen extends React.Component {

    static navigationOptions = {
        title: "Enter Code"
    };

    render() {
        const { navigate } = this.props.navigation;

        var validateCode = () => {
            // TODO: validate code
            return true;
        };

        return (
            <View style={styles.container}>
                <Text
                    style={{fontSize:30, color: "#666"}}
                >Man With A Van</Text>
                <TextInput
                    style={{height: 40, width: 200, margin:30, textAlign: 'center'}}
                    placeholder="Enter Code"
                />
                <Button
                    onPress={() => validateCode ? navigate('Form') : false}
                    title="Join"
                    color="#00796B"
                />
            </View>
        );
    }
}

class FormScreen extends React.Component {

    static navigationOptions = {
        title: "Describe Your Moving Needs"
    };

    render() {
        const { navigate } = this.props.navigation;

        var validateForm = () => {
            // TODO: validate form
            Alert.alert(
                'Please Wait',
                'Looking for movers near you. We\'ll let you know when someone accepts your job.',
                [
                    {text: 'Cancel Request'},
                ],
                { cancelable: false }
            )
        };

        return (
            <View style={styles.container}>
                <TextInput
                    style={{height: 40, width: "90%", margin:10}}
                    placeholder="Start Address"
                />
                <TextInput
                    style={{height: 40, width: "90%", margin:10}}
                    placeholder="End Address"
                />
                <View style={{flex:0, flexDirection: "row", justifyContent: "space-between", width: "90%"}}>
                <TextInput
                    style={{height: 40, width: "45%", marginTop:10, marginBottom:10}}
                    placeholder="Start Time"
                />
                <TextInput
                    style={{height: 40, width: "45%", marginTop:10, marginBottom:10}}
                    placeholder="End Time"
                />
                </View>
                <TextInput
                    style={{height: 40, width: "90%", margin:10}}
                    placeholder="Maximum Price"
                />
                <TextInput
                    style={{height: 40, width: "90%", margin:10}}
                    placeholder="Describe the job"
                />
                <Text style={{height: 40, width: "90%", margin:10}}>📷 Upload Photos</Text>
                <Button
                    onPress={() => validateForm()}
                    title="Find Movers"
                    color="#00796B"
                />
            </View>
        );
    }

}

const App = StackNavigator({
    GetCode: { screen: GetCodeScreen },
    EnterCode: { screen: EnterCodeScreen },
    Form: { screen: FormScreen },
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }

});

export default App;