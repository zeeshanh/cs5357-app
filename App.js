import React, { Component } from 'react';
import { Button, StyleSheet, Text, TextInput, ScrollView, View, Alert, FlatList} from 'react-native';
import { StackNavigator } from 'react-navigation';

class GetCodeScreen extends React.Component {

    static navigationOptions = {
        header: null
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
        header: null
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
        header: null
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
                { cancelable: true }
            );
            return true;
        };

        return (
            <ScrollView>
                <View style={styles.containerTop}>
                    <View style={styles.grayHeader}>
                        <Text style={styles.h1}>What do you need help with today?</Text>
                        <Text style={{height: 20, width: "90%", margin:10}}>Enter your details and we&#8217;ll find you a mover!</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Start Address"
                    />
                    <TextInput
                        style={styles.input}
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
                        style={styles.input}
                        placeholder="Maximum Price"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Describe the job"
                    />
                    <Text style={{height: 40, width: "90%", margin:10}}>📷 Upload Photos</Text>
                    <View style={styles.grayFooter}>
                        <Button
                            onPress={() => validateForm() ? navigate('MoverList') : false}
                            title="Find Movers"
                            color="#00796B"
                        />
                    </View>
                </View>
            </ScrollView>
        );
    }
}

class MoverList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [ // Hardcoded for now
                { key: 0, values: {
                    "name": "Jeff McMover",
                    "photo": "link/to/image",
                    "price": 400,
                    "startTime": new Date("Tue Mar 24 2015 20:00:00 GMT-0400 (EDT)"),
                    "rating": 4.9
                    }
                },
                { key: 1, values: {
                    "name": "Joe Moverson",
                    "photo": "link/to/image",
                    "price": 425,
                    "startTime": new Date("Tue Mar 24 2015 20:00:00 GMT-0400 (EDT)"),
                    "rating": 4.8
                    }
                }
            ]
        }
    }

    render() {

        return(
            <View style={styles.containerTop}>

            <View style={styles.grayHeader}>
                <Text style={styles.h1}>{this.state.data.length} movers are available{this.state.data.length > 0 ? "!" : " :("}</Text>
            </View>

            <FlatList
                data={this.state.data}

                renderItem={({item}) => (
                    <View
                        style={styles.moverListItem}
                    >
                        <Text>{item.values.name}</Text>
                        <Text>${item.values.price} | Start at {item.values.startTime.getHours()}:{item.values.startTime.getMinutes()} | {item.values.rating}/5 Stars</Text>
                        <Button
                            onPress={() => alert("hi")}
                            title="Details"
                            color="#00796B"
                        />
                    </View>
                )}
            />
                <View style={styles.grayFooter}>
                    <View style={{flex:0, flexDirection: "row", justifyContent: "space-between", width: "90%"}}>
                        <Text style={{height: 40, margin:10}}>Refresh List</Text>
                        <Text style={{height: 40, margin:10}}>Sort</Text>
                    </View>
                </View>

             </View>
        );
    }
}

class MoverListScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    render() {
        const {navigate} = this.props.navigation;

        return (
            <ScrollView>
                <MoverList />
            </ScrollView>
        );
    }
}


const App = StackNavigator({
    GetCode: { screen: GetCodeScreen },
    EnterCode: { screen: EnterCodeScreen },
    Form: { screen: FormScreen },
    MoverList: { screen: MoverListScreen}
    },
    {
        headerMode: 'screen'
    });


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerTop: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    grayHeader: {
        backgroundColor: "#e8e8e8",
        width: "100%",
        paddingTop: 40,
        paddingBottom: 20,
        flex: 0,
        alignItems: 'center',
        marginBottom: 20,
    },
    grayFooter: {
        backgroundColor: "#e8e8e8",
        width: "100%",
        paddingTop: 40,
        paddingBottom: 60,
        flex: 0,
        alignItems: 'center'
    },
    h1: {
        height: 30,
        width: "90%",
        margin:10,
        fontSize:20,
        color: "#666"
    },
    input: {
        height: 40,
        width: "90%",
        margin:10
    },
    moverListItem: {
        paddingBottom: 20,
    }

});

export default App;