import React, { Component } from 'react';
import { Button, StyleSheet, Text, TextInput, ScrollView, View, Alert, FlatList, Image, TouchableHighlight, TouchableOpacity} from 'react-native';
import { StackNavigator, TabNavigator, TabView} from 'react-navigation';
import DateTimePicker from 'react-native-modal-datetime-picker';

var userType; // either mover or requester
var validatedPhone = false;

// Register/login
class InitialOptionScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    render() {

        const { navigate } = this.props.navigation;

        const validatePhone = () => {
            // TODO: validate phone number
            return true;
        };

        return (
            // Nothing is styled yet 😣
            <View style={styles.container}>
                <Text
                    style={{fontSize:30, color: "#666"}}
                >Man With A Van</Text>
                <TouchableOpacity
                    onPress={() => {
                        userType = 'mover';
                        navigate('Login');
                    }}
                    style={styles.bigButton}
                >
                    <Text style={{color: "#fff", fontSize: 20}}>Login as Mover</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        userType = 'requester';
                        navigate('Login');
                    }}
                    style={styles.bigButton}
                >
                    <Text style={{color: "#fff", fontSize: 20}}>Login as Requester</Text>
                </TouchableOpacity>

                    <Text
                    onPress={() => {
                        userType = 'mover';
                        navigate('Register');
                    }}
                    style={{margin: 5}}
                    >Register as Mover</Text>

                    <Text
                    onPress={() => {
                        userType = 'requester';
                        navigate('Register');
                    }}
                    style={{margin: 5}}
                    >Register as Requester</Text>

            </View>
        );
    }
}

class RegisterScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    render() {
        const { navigate } = this.props.navigation;
        const isMover = userType == 'mover' ? true : false;

        const submitForm = () => {
            // TODO: Validate form and submit
            return true;
        };

        return (
            <ScrollView>
                <View style={styles.containerTop}>
                    <View style={styles.grayHeader}>
                        <Text style={styles.h1}>Register as {userType}</Text>
                    </View>
                    <View style={{flex:0, flexDirection: "row", justifyContent: "space-between", width: "90%"}}>
                        <TextInput
                            style={{height: 40, width: "45%", marginTop:10, marginBottom:10}}
                            placeholder="First Name"
                        />
                        <TextInput
                            style={{height: 40, width: "45%", marginTop:10, marginBottom:10}}
                            placeholder="Last Name"
                        />
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                    />
                    <TextInput
                        style={[styles.input, {display: isMover ? 'flex' : 'none'}]}
                        placeholder="Zip Code"
                    />
                    <TextInput
                        style={[styles.input, {display: isMover ? 'flex' : 'none'}]}
                        placeholder="Vehicle Type"
                    />
                    <TextInput
                        style={[styles.input, {display: isMover ? 'flex' : 'none'}]}
                        placeholder="Payment Types Accepted"
                    />
                    <Text style={{height: 40, width: "90%", margin:10}}>📷 Upload Profile Photo</Text>
                    <View style={styles.grayFooter}>
                        <Button
                            onPress={() => submitForm() ? navigate('GetCode') : false}
                            title="Create Account"
                            color="#00796B"
                        />
                    </View>
                </View>
            </ScrollView>
        );
    }
}

class LoginScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    render() {

        const { navigate } = this.props.navigation;

        const validateLogin = () => {
            // TODO: validate login credentials
            return true;
        };

        return (
            <View style={styles.container}>
                <Text
                    style={{fontSize:30, color: "#666", textAlign: 'center', margin: 10}}
                >Welcome back!</Text>
                <Text
                    style={{fontSize:20, color: "#666", textAlign: 'center',  margin: 10}}
                >Login as {userType}</Text>
                <TextInput
                    style={{height: 40, width: 200, margin:10, width: "90%", textAlign: 'center'}}
                    placeholder="Username"
                />
                <TextInput
                    style={{height: 40, width: 200, margin:10, width: "90%", textAlign: 'center'}}
                    placeholder="Password"
                />
                <TouchableOpacity
                    onPress={() => {
                        if (userType == 'requester' && validateLogin) {
                            navigate('Requester');
                        } else if (userType == 'mover' && validateLogin){
                            navigate('Mover');
                        }
                    }}
                    style={styles.bigButton}
                ><Text style={{color: "#fff", fontSize: 20}}>Log In</Text></TouchableOpacity>
            </View>
        );
    }
}

class GetCodeScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    render() {

        const { navigate } = this.props.navigation;

        const validatePhone = () => {
            // TODO: validate phone number
            return true;
        };

        return (
            <View style={styles.container}>
                <Text
                    style={{fontSize:20, color: "#666", textAlign: 'center', margin: 10}}
                >Please validate your phone number</Text>

                <TextInput
                    style={{height: 40, width: 200, margin:30, textAlign: 'center'}}
                    placeholder="Enter Phone Number"
                />
                <TouchableOpacity
                    onPress={() => validatePhone ? navigate('EnterCode') : false}
                    style={styles.bigButton}
                ><Text style={{color: "#fff", fontSize: 20}}>Get Code</Text></TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        if (userType == 'requester') {
                            navigate('Requester');
                        } else {
                            navigate('Mover');
                        }
                    }}
                    style={[styles.bigButton, {backgroundColor: "#666"}]}
                ><Text style={{color: "#fff", fontSize: 20}}>I'll Do This Later</Text></TouchableOpacity>

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

        const validateCode = () => {
            // TODO: validate code
            return true;
        };

        return (
            <View style={styles.container}>
                <Text
                    style={{fontSize:30, color: "#666", textAlign: 'center', margin: 10}}
                >Thanks for entering your phone.</Text>
                <Text
                    style={{fontSize:20, color: "#666", textAlign: 'center',  margin: 10}}
                >We have sent you a validation code. Please enter it below.</Text>
                <TextInput
                    style={{height: 40, width: 200, margin:30, textAlign: 'center'}}
                    placeholder="Enter Code"
                />

                <TouchableOpacity
                    onPress={() => {
                        if (userType == 'requester' && validateCode) {
                            validatedPhone = true;
                            navigate('Requester');
                        } else if (validateCode) {
                            validatedPhone = true;
                            navigate('Mover');
                        }
                    }}
                    style={styles.bigButton}
                ><Text style={{color: "#fff", fontSize: 20}}>Join</Text></TouchableOpacity>
            </View>
        );
    }
}

// Requester Screens
class RequestFormScreen extends React.Component {

    static navigationOptions = {
        tabBarLabel: 'Request',
    };

    constructor(props) {
        super(props);
        this.state = {
            startAddress: '',
            endAddress: '',
            startTime: '',
            endTime: '',
            maximumPrice: '',
            description: '',
            timePickerVisible: false,
            activeField: null
        };
    }

    render() {
        const { navigate } = this.props.navigation;

        const validateForm = () => {
            var errors = "";

            if (this.state.startAddress.length == 0) {
                errors += "Start address cannot be empty\n";
            }

            if (this.state.endAddress.length == 0) {
                errors += "End address cannot be empty\n";
            }

            if (this.state.startTime.length == 0) {
                errors += "Start time cannot be empty\n";
            }

            if (this.state.endTime.length == 0) {
                errors += "End time cannot be empty\n";
            }

            if (this.state.maximumPrice.length == 0) {
                errors += "Maximum price cannot be empty\n";
            } else if (!(/^\$?\d{1,10}(?:\.\d{1,4})?$/.test(this.state.maximumPrice))) {
                errors += "Maximum price is not a valid price format\n";
            }

            if (this.state.description.length == 0) {
                errors += "Description cannot be empty\n";
            }

            if (errors) {
                alert("Please fix these errors:\n\n" + errors);
            } else {
                return true;
            }
        };

        return (
            <ScrollView>
                <DateTimePicker
                    mode="time"
                    isVisible={this.state.timePickerVisible}
                    onConfirm={() => {
                        // TODO: record the selected time
                        this.setState({timePickerVisible: false});
                    }}
                    onCancel={() => {
                        this.setState({timePickerVisible: false});
                    }}
                />
                <View style={styles.containerTop}>
                    <View style={styles.grayHeader}>
                        <Text style={styles.h1}>Submit a new job request</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Start Address"
                        onChangeText={(text) => this.setState({startAddress: text})}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="End Address"
                        onChangeText={(text) => this.setState({endAddress: text})}
                    />
                    <View style={{flex:0, flexDirection: "row", justifyContent: "space-between", width: "90%"}}>
                        <TextInput
                            style={{height: 40, width: "45%", marginTop:10, marginBottom:10}}
                            placeholder="Start Time"
                            onFocus={() => this.setState({timePickerVisible: true, activeField: "startTime"})}
                            onChangeText={(text) => this.setState({startTime: text})}
                        />
                        <TextInput
                            style={{height: 40, width: "45%", marginTop:10, marginBottom:10}}
                            placeholder="End Time"
                            onFocus={() => this.setState({timePickerVisible: true, activeField: "endTime"})}
                            onChangeText={(text) => this.setState({endTime: text})}
                        />
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Maximum Price"
                        onChangeText={(text) => this.setState({maximumPrice: text})}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Describe the job"
                        onChangeText={(text) => this.setState({description: text})}
                    />
                    <Text style={{height: 40, width: "90%", margin:10}}>📷 Upload Photos</Text>
                    <View style={styles.grayFooter}>
                        <TouchableOpacity
                            onPress={() => validateForm() ? navigate('Movers') : false}
                            style={styles.bigButton}
                        ><Text style={{color: "#fff", fontSize: 20}}>Find Movers</Text></TouchableOpacity>
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
                    "id": 0,
                    "name": "Jeff McMover",
                    "photo": require("./img/jeff.png"),
                    "price": 400,
                    "startTime": new Date("Tue Mar 24 2015 20:00:00 GMT-0400 (EDT)"),
                    "rating": 4.9,
                    "phone": "555-867-5309",
                    "vehicle": "Large box truck",
                    "payment": "Cash, Venmo"
                    }
                },
                { key: 1, values: {
                    "id": 1,
                    "name": "Joe Moverson",
                    "photo": require("./img/jeff.png"),
                    "price": 425,
                    "startTime": new Date("Tue Mar 24 2015 20:00:00 GMT-0400 (EDT)"),
                    "rating": 4.8,
                    "phone": "555-867-5311",
                    "vehicle": "Small box truck",
                    "payment": "Cash ONLY"
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
                style={{width: "100%"}}

                renderItem={({item}) => (
                    <View
                        style={{padding: 20, flexDirection: "row", justifyContent: "space-between"}}
                    >
                        <Image source={item.values.photo} style={{width: 40, height: 40}}/>
                        <View style={{marginRight: 10}}>
                        <Text style={{fontSize: 16, fontWeight: "bold", color: "#333"}}>{item.values.name}</Text>
                            <Text>${item.values.price} | Start at {item.values.startTime.getHours()}:{item.values.startTime.getMinutes()} | {item.values.rating}/5 Stars</Text>
                        </View>
                        <Text
                            onPress={() => this.props.navigation.navigate("ViewMover", {moverInfo: item.values})}
                            style={{fontWeight: "bold", color: "#00796B"}}
                        >
                            Details
                        </Text>
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

        return (
            <ScrollView>
                <MoverList navigation={this.props.navigation} />
            </ScrollView>
        );
    }
}

MoverListScreen.router = MoverList.router; // Nested navigator: https://reactnavigation.org/docs/intro/nesting

class MoverDetailScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.navigation.state.params.moverInfo,
            preAccept: "flex",
            postAccept: "none"
        }
    }

    static navigationOptions = {
        header: null
    };

    render() {
        const { navigate } = this.props.navigation;

        const acceptOffer = () => {
            this.setState({preAccept: "none", postAccept: "flex"});
        };

        return (

            <View style={{flex: 1, justifyContent: "space-between"}}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff"}}>
                    <Image source={this.state.data.photo} style={{marginTop: 50, width: 100, height: 100}}/>
                    <Text style={{
                        height: 30,
                        width: "90%",
                        margin:10,
                        fontSize:20,
                        color: "#666",
                        textAlign: 'center'
                    }}>{this.state.data.name}</Text>
                    <Text style={{margin:20, fontSize:16}}>${this.state.data.price} | Start at {this.state.data.startTime.getHours()}:{this.state.data.startTime.getMinutes()} | {this.state.data.rating}/5 Stars</Text>
                    <Text style={{margin:10, fontSize:16}}>Phone: {this.state.data.phone}</Text>
                    <Text style={{margin:10, fontSize:16}}>Drives: {this.state.data.vehicle}</Text>
                    <Text style={{margin:10, fontSize:16}}>Accepts: {this.state.data.payment}</Text>
                </View>

                <View style={[styles.grayFooter, {display: this.state.preAccept}]}>
                    <TouchableOpacity
                            onPress={() => acceptOffer() }
                            style={styles.bigButton}
                        ><Text style={{color: "#fff", fontSize: 20}}>Accept Offer</Text></TouchableOpacity>
                    <Text
                        style={{margin:30, fontSize:16, color: "#666"}}
                        onPress={() => navigate("MoverList")}
                    >View Other Offers</Text>
                </View>


                <View style={[styles.grayFooter, {display: this.state.postAccept}]}>
                    <Text
                        style={{margin:10, fontWeight: "bold", fontSize:20, color: "#00796B"}}
                    >Offer Accepted!</Text>
                    <Text
                        style={{marginTop:10, margin: 20, marginBottom: 30, fontSize:16, textAlign: 'center', color: "#666"}}
                    >Don&#8217;t forget to contact {this.state.data.name.split(" ")[0]} to confirm details and be sure to pay when the job is done!</Text>

                    <Button
                        onPress={() => navigate("Review") }
                        title="Job Done? Leave a Review!"
                        color="#00796B"
                    />
                </View>
            </View>
        );
    }
}

class ReviewScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {
                // Should get this from the database
                "id": 0,
                "name": "Jeff McMover",
                "photo": require("./img/jeff.png"),
                "price": 400,
                "startTime": new Date("Tue Mar 24 2015 20:00:00 GMT-0400 (EDT)"),
                "rating": 4.9,
                "phone": "555-867-5309",
                "vehicle": "Large box truck",
                "payment": "Cash, Venmo"
            },
            numStars: 0,
        };

        this.filledStar = require("./img/filledStar.png");
        this.unfilledStar = require("./img/unfilledStar.png");

    }

    static navigationOptions = {
        header: null
    };


    render() {
        const { navigate } = this.props.navigation;

        const recordRating = () => {
            Alert.alert(
                'Thank You!',
                'You have rated ' + this.state.data.name.split(" ")[0] + ' ' + this.state.numStars + ' stars.',
                [
                    {text: 'Exit', onPress: () => navigate("Requester")},
                ],
                { cancelable: true }
            );
        };

        return (
            <View style={{flex: 1, justifyContent: "space-between"}}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff"}}>
                    <Text style={[styles.h1, {textAlign: "center"}]}>Review Your Mover</Text>
                    <Image source={this.state.data.photo} style={{marginTop: 20, width: 100, height: 100}}/>
                    <Text style={[styles.h1, {textAlign: "center"}]}>{this.state.data.name}</Text>
                    <Text style={{margin:20, fontSize:16}}>Please rate {this.state.data.name.split(" ")[0]} out of 5 stars.</Text>
                    <View style={{flexDirection: "row"}}>
                        <TouchableHighlight onPress={() => this.setState({numStars: 1})} underlayColor="#fff">
                            <Image
                                source={this.state.numStars > 0 ? this.filledStar : this.unfilledStar}
                                style={{width: 40, height: 40}}
                            />
                        </TouchableHighlight>

                        <TouchableHighlight onPress={() => this.setState({numStars: 2})} underlayColor="#fff">
                            <Image
                                source={this.state.numStars > 1 ? this.filledStar : this.unfilledStar}
                                style={{width: 40, height: 40}}
                                onPress={() => this.setState({numStars: 2}) }
                            />
                        </TouchableHighlight>

                        <TouchableHighlight onPress={() => this.setState({numStars: 3})} underlayColor="#fff">
                            <Image
                                source={this.state.numStars > 2 ? this.filledStar : this.unfilledStar}
                                style={{width: 40, height: 40}}
                                onPress={() => this.setState({numStars: 3}) }
                            />
                        </TouchableHighlight>

                        <TouchableHighlight onPress={() => this.setState({numStars: 4})} underlayColor="#fff">
                            <Image
                                source={this.state.numStars > 3 ? this.filledStar : this.unfilledStar}
                                style={{width: 40, height: 40}}
                                onPress={() => this.setState({numStars: 4})}
                            />
                        </TouchableHighlight>

                        <TouchableHighlight onPress={() => this.setState({numStars: 5})} underlayColor="#fff">
                            <Image
                                source={this.state.numStars > 4 ? this.filledStar : this.unfilledStar}
                                style={{width: 40, height: 40}}
                                onPress={() => this.setState({numStars: 5})}
                            />
                        </TouchableHighlight>
                    </View>
                </View>

                <View style={styles.grayFooter}>
                    <TouchableOpacity
                            onPress={() => recordRating()}
                            style={styles.bigButton}
                        ><Text style={{color: "#fff", fontSize: 20}}>Submit Review</Text></TouchableOpacity>
                    <Text
                        style={{margin:30, fontSize:16, color: "#666"}}
                        onPress={() => navigate("Requester")}
                    >Cancel</Text>
                </View>
            </View>
        );
    }
}

class ProfileScreen extends React.Component {
    static navigationOptions = {
        tabBarLabel: 'Profile',
    };

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const { navigate } = this.props.navigation;
        const isMover = userType == 'mover' ? true : false;

        const submitForm = () => {
            // TODO: Validate form and submit
            return true;
        };

        return (
            <ScrollView>
                <View style={styles.containerTop}>
                    <View style={styles.grayHeader}>
                        <Text style={styles.h1}>Update Profile</Text>
                    </View>
                    <Text
                        style={{display: validatedPhone ? 'none' : 'flex', width: "100%", backgroundColor: "yellow", padding: 5, marginTop: 0}}
                        onPress={() => navigate('GetCode')}
                    >Phone not yet validated. Tap here to validate phone</Text>
                    <View style={{flex:0, flexDirection: "row", justifyContent: "space-between", width: "90%"}}>
                        <TextInput
                            style={{height: 40, width: "45%", marginTop:10, marginBottom:10}}
                            placeholder="First Name"
                        />
                        <TextInput
                            style={{height: 40, width: "45%", marginTop:10, marginBottom:10}}
                            placeholder="Last Name"
                        />
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                    />
                    <TextInput
                        style={[styles.input, {display: isMover ? 'flex' : 'none'}]}
                        placeholder="Zip Code"
                    />
                    <TextInput
                        style={[styles.input, {display: isMover ? 'flex' : 'none'}]}
                        placeholder="Vehicle Type"
                    />
                    <TextInput
                        style={[styles.input, {display: isMover ? 'flex' : 'none'}]}
                        placeholder="Payment Types Accepted"
                    />
                    <Text style={{height: 40, width: "90%", margin:10}}>📷 Upload New Profile Photo</Text>
                    <View style={styles.grayFooter}>

                        <TouchableOpacity
                             onPress={() => {
                                if (submitForm) {
                                    if (userType == "requester") {
                                        navigate('Requester');
                                    } else {
                                        navigate("JobList");
                                    }
                                }
                            }}
                            style={styles.bigButton}
                        ><Text style={{color: "#fff", fontSize: 20}}>Save Changes</Text></TouchableOpacity>

                        <Text
                            onPress={() => {
                                if (userType == "requester") {
                                    navigate('Requester');
                                } else {
                                    navigate("JobList");
                                }
                            }}
                        >Cancel</Text>
                    </View>
                </View>
            </ScrollView>);
    }
}

// Mover Screens
class JobList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [ // Hardcoded for now
                { key: 0, values: {
                    "id": 0,
                    "description": "Moving some stuff",
                    "maxPrice": 1,
                    "startAddress": "[start addr]",
                    "endAddress": "[end addr]",
                    "startTime": "1pm",
                    "endTime": "6pm",
                    "photo": require("./img/boxes.jpg"),
                    }
                },
                { key: 1, values: {
                    "id": 0,
                    "description": "Another job",
                    "maxPrice": 1,
                    "startAddress": "[start addr]",
                    "endAddress": "[end addr]",
                    "startTime": "1pm",
                    "endTime": "6pm",
                    "photo": require("./img/boxes.jpg"),
                    }
                },
            ]
        }
    }

    render() {

        return(
            <View style={styles.containerTop}>

            <View style={styles.grayHeader}>
                <Text style={styles.h1}>{this.state.data.length} jobs are available{this.state.data.length > 0 ? "!" : " :("}</Text>
            </View>

            <FlatList
                data={this.state.data}
                style={{width: "100%"}}

                renderItem={({item}) => (
                    <View
                        style={{padding: 20, flexDirection: "row", justifyContent: "space-between"}}
                    >
                        <Image source={item.values.photo} style={{maxWidth: 80, maxHeight: 60}}/>
                        <View style={{marginRight: 10}}>
                        <Text style={{fontSize: 16, fontWeight: "bold", color: "#333"}}>{item.values.description}</Text>
                            <Text>Max ${item.values.maxPrice} | Start at {item.values.startTime}</Text>
                        </View>
                        <Text
                            onPress={() => this.props.navigation.navigate("JobDetail", {jobInfo: item.values})}
                            style={{fontWeight: "bold", color: "#00796B"}}
                        >
                            Details
                        </Text>
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

class JobListScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    render() {

        return (
            <ScrollView>
                <JobList navigation={this.props.navigation} />
            </ScrollView>
        );
    }
}

JobListScreen.router = JobList.router; // Nested navigator: https://reactnavigation.org/docs/intro/nesting

class JobDetailScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.navigation.state.params.jobInfo,
            preAccept: "flex",
            postAccept: "none"
        }
    }

    static navigationOptions = {
        header: null
    };

    render() {
        const { navigate } = this.props.navigation;

        const placeOffer = () => {
            this.setState({preAccept: "none", postAccept: "flex"});
        };

        return (
            <ScrollView>
            <View style={{flex: 1, justifyContent: "space-between", marginTop: 40}}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff"}}>

                    <Text style={{
                        height: 30,
                        width: "90%",
                        margin:10,
                        fontSize:20,
                        color: "#666",
                    }}>{this.state.data.description}</Text>

                    <View style={{flex:0, flexDirection: "row", width: "90%", padding: 10, borderBottomWidth: 1, borderBottomColor: "#999"}}>
                        <View style={{width: "50%"}}>
                            <Text>Max Price: ${this.state.data.maxPrice}</Text>
                        </View>
                        <View>
                            <Text>Other offers: $x - $y</Text>
                        </View>
                    </View>

                    <View style={{flex:0, flexDirection: "row", width: "90%",  padding: 10, borderBottomWidth: 1, borderBottomColor: "#999"}}>
                        <View style={{width: "50%"}}>
                            <Text>Start time: {this.state.data.startTime}</Text>
                            <Text>End time: {this.state.data.endTime}</Text>
                        </View>
                        <View>
                            <Text>Start address: {this.state.data.startAddress}</Text>
                            <Text>End address: {this.state.data.endAddress}</Text>
                        </View>
                    </View>

                    <Image source={this.state.data.photo} style={{margin: 50, width: "90%", height:100}}/>

                </View>

                <View style={[styles.grayFooter, {display: this.state.preAccept}]}>
                    <TextInput placeholder="Amount" />
                    <TextInput placeholder="Start Time" />

                    <TouchableOpacity
                             onPress={() => placeOffer() }
                            style={styles.bigButton}
                        ><Text style={{color: "#fff", fontSize: 20}}>Place Offer</Text></TouchableOpacity>
                    <Text
                        style={{margin:30, fontSize:16, color: "#666"}}
                        onPress={() => navigate("JobList")}
                    >View Other Jobs</Text>
                </View>

                <View style={[styles.grayFooter, {display: this.state.postAccept}]}>
                    <Text
                        style={{margin:10, fontWeight: "bold", fontSize:30, color: "#00796B"}}
                    >Offer placed!</Text>
                    <Text
                        style={{marginTop:10, margin: 20, marginBottom: 30, fontSize:16, textAlign: 'center', color: "#666"}}
                    >We will let you know if the requester accepts your offer.</Text>
                </View>
            </View>
            </ScrollView>
        );
    }
}



const App = StackNavigator({
    InitialOptions: { screen: InitialOptionScreen },
    Register: { screen: RegisterScreen },
    Login: { screen: LoginScreen },
    GetCode: { screen: GetCodeScreen },
    EnterCode: { screen: EnterCodeScreen },
    Requester: { screen: TabNavigator({
        RequestForm: { screen: RequestFormScreen },
        Profile: { screen: ProfileScreen },
        Movers: { screen: StackNavigator({
            MoverList: { screen: MoverListScreen },
            ViewMover: { screen: MoverDetailScreen},
            Review: { screen: ReviewScreen },
        }),
            navigationOptions: ({ navigation }) => ({
            header: null,
        }),
    }
    }), navigationOptions: ({ navigation }) => ({
            header: null,
        }),
    },
    Mover: { screen: TabNavigator({
        Profile: { screen: ProfileScreen },
        Jobs: { screen: StackNavigator({
            JobList: { screen: JobListScreen },
            JobDetail: { screen: JobDetailScreen},
        }), navigationOptions: ({ navigation }) => ({
            header: null,
        }), initialRouteName: 'Jobs'
    }
    }), navigationOptions: ({ navigation }) => ({
            header: null,
        }),
    },

});

const styles = StyleSheet.create({
    //https://material.io/guidelines/style/color.html#color-color-palette
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
        padding: 20,
        flex: 0,
        alignItems: 'center',
        marginBottom: 20,
    },
    grayFooter: {
        backgroundColor: "#e8e8e8",
        width: "100%",
        paddingTop: 20,
        paddingBottom: 40,
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
    },
    bigButton: {
        backgroundColor: "#00796B",
        width: "90%",
        padding: 10,
        margin: 10,
        alignItems: "center"
    }


});

export default App;