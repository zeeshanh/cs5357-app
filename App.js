import React, { Component } from 'react';
import { Button, StyleSheet, Text, TextInput, ScrollView, View, Alert, FlatList, Image, TouchableHighlight, TouchableOpacity} from 'react-native';
import { StackNavigator, TabNavigator, TabView} from 'react-navigation';
import DateTimePicker from 'react-native-modal-datetime-picker';

var userType; // either mover or requester
var validatedPhone = false; // keep track of whether phone has been validated
var api = "http://127.0.0.1:8080";

const sanitizeInput = (str) => {
    // https://stackoverflow.com/questions/822452/strip-html-from-text-javascript
    return str.trim().replace(/<(?:.|\n)*?>/gm, '');
};

const validateStr = (label, str, maxLen) => {
    str = sanitizeInput(str);
    if (str == "") {
        return label + " cannot be blank";
    } else if (str.length > maxLen) {
        return label + " cannot be over " + maxLen + " characters";
    } else {
        return ""
    }
};

const validateInt = (label, i, len) => {
    i = sanitizeInput(i);
    if (!(i)) {
        return label + " cannot be blank";
    } else if (!(/^\d+$/.test(i))) {
        return label + " must be a number"
    } else if (i.toString().length != len) {
        return label + " must be " + len + " digits";
    } else {
        return ""
    }
};

// Takes phone string and returns numbers
const getPhoneFromInput = (input) => {
    var re = /[0-9]/g;
    phone = input.match(re);
    if (phone) {
        phone = phone.join("");
        return phone;
    }
    return "";
};

/*--Entry screens: visible to movers and requesters--*/
// 1. InitialOptionScreen: Choose to login or register as mover or requester
// 2. RegisterScreen: Register an account
// 3. LoginScreen: Login with an existing account
// 4. GetCodeScreen: Enter phone number, receive a code via SMS
// 5. EnterCodeScreen: Enter the code you received via SMS to validate your phone #

class InitialOptionScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    render() {

        const { navigate } = this.props.navigation;

        return (
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

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            zipcode: '',
            vehicle: '',
            payment: '',

            firstNameError: '',
            lastNameError: '',
            usernameError: '',
            passwordError: '',
            zipcodeError: '',
            vehicleError: '',
            paymentError: '',

            allErrors: '',
        };
    }

    render() {
        const {navigate} = this.props.navigation;
        const isMover = userType == 'mover' ? true : false;

        const submitForm = () => {

            /* -- Validate Form --*/

            this.setState({
                firstNameError: validateStr("First name", this.state.firstName, 100),
                lastNameError: validateStr("Last name", this.state.lastName, 100),
                usernameError: validateStr("Username", this.state.username, 50),
                passwordError: validateStr("Password", this.state.password, 100),
            }, () => {

                if (isMover) {
                    this.setState({
                        zipcodeError: validateInt("Zipcode", this.state.zipcode, 5),
                        vehicleError: validateStr("Vehicle", this.state.vehicle, 100),
                        paymentError: validateStr("Payment", this.state.payment, 50),
                    });
                }

                if (this.state.firstNameError == ""
                    && this.state.lastNameError == ""
                    && this.state.usernameError == ""
                    && this.state.passwordError == ""
                    && this.state.zipcodeError == ""
                    && this.state.vehicleError == ""
                    && this.state.paymentError == ""
                ) {

                    const validData = {
                        "type": userType,
                        "first_name": this.state.firstName,
                        "last_name": this.state.lastName,
                        "username": this.state.username,
                        "password": this.state.password,
                        "zipcode": this.state.zipcode,
                        "vehicle": this.state.vehicle,
                        "payment": this.state.payment,
                    }

                    // POST new user to database

                    fetch(api + "/profile", {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(validData)
                    }).then(response => {
                        if (response.status === 201) {
                            navigate("GetCode");
                        } else {
                            console.log(response);
                            throw new Error('Something went wrong on api server!');
                        }
                    })

                } else {
                    this.setState({allErrors: "Please fix errors."});
                    return false;
                }

            });
        };

        return (
                <View style={styles.container}>
                    <Text style={styles.h1}>Register as {userType}</Text>
                    <View style={{flex:0, flexDirection: "row", justifyContent: "space-between", width: "90%"}}>
                        <View style={{ width: "45%", height: 40}}>
                        <TextInput
                            style={{height: 40, width: "100%", marginTop:10, marginBottom:5}}
                            placeholder="First Name"
                            onChangeText={(text) => this.setState({
                                    firstName: text,
                                    firstNameError: validateStr("First name", text, 100)
                                })
                            }
                        />
                        <Text style={styles.errorText}>{ this.state.firstNameError }</Text>
                        </View>

                        <View style={{ width: "45%", height: 40}}>
                        <TextInput
                            style={{height: 40, width: "100%", marginTop:10, marginBottom:5}}
                            placeholder="Last Name"
                            onChangeText={(text) => this.setState({
                                    lastName: text,
                                    lastNameError: validateStr("Last name", text, 100)
                                })
                            }
                        /><Text style={styles.errorText}>{ this.state.lastNameError }</Text>
                        </View>
                    </View>

                    <View style={styles.formField}>
                    <TextInput
                        style={{height: 40, width: "100%", marginTop:10, marginBottom:5}}
                        placeholder="Username"
                        onChangeText={(text) => this.setState({
                            username: text,
                            usernameError: validateStr("Username", text, 50)
                        })
                        }
                    /><Text style={styles.errorText}>{ this.state.usernameError }</Text>
                    </View>

                    <View style={styles.formField}>
                    <TextInput
                        style={{height: 30, width: "100%", marginTop:10, marginBottom:5}}
                        placeholder="Password"
                        secureTextEntry={true}
                        onChangeText={(text) => this.setState({
                                    password: text,
                                    passwordError: validateStr("Password", text, 100)
                                })
                            }
                    /><Text style={styles.errorText}>{ this.state.passwordError }</Text>
                    </View>

                    <View style={styles.formField}>
                    <TextInput
                        style={{height: 40, width: "100%", marginTop:10, marginBottom:5, display: isMover ? 'flex' : 'none'}}
                        placeholder="Zip Code"
                        onChangeText={(text) => this.setState({
                                    zipcode: text,
                                    zipcodeError: validateInt("Zipcode", text, 5)
                                })
                            }
                    /><Text style={styles.errorText}>{ this.state.zipcodeError }</Text>
                    </View>

                    <View style={styles.formField}>
                    <TextInput
                        style={{height: 40, width: "100%", marginTop:10, marginBottom:5, display: isMover ? 'flex' : 'none'}}
                        placeholder="Vehicle Type"
                        onChangeText={(text) => this.setState({
                                    vehicle: text,
                                    vehicleError: validateStr("Vehicle", text, 100)
                                })
                            }
                    /><Text style={styles.errorText}>{ this.state.vehicleError }</Text>
                    </View>

                    <View style={styles.formField}>
                    <TextInput
                        style={{height: 40, width: "100%", marginTop:10, marginBottom:5, display: isMover ? 'flex' : 'none'}}
                        placeholder="Payment Types Accepted"
                        onChangeText={(text) => this.setState({
                                    payment: text,
                                    paymentError: validateStr("Payment", text, 100)
                                })
                            }
                    /><Text style={styles.errorText}>{ this.state.paymentError }</Text>
                    </View>

                    <Text style={{height: 40, width: "90%", marginTop: 30, margin:10}}>📷 Upload Profile Photo</Text>

                    <TouchableOpacity
                        onPress={() => submitForm() ? navigate('GetCode') : false}
                        style={styles.bigButton}
                    >
                        <Text style={{color: "#fff", fontSize: 20}}>Create Account</Text>
                    </TouchableOpacity>
                    <Text style={styles.errorText}>{ this.state.allErrors }</Text>
                </View>
        );
}

}

class LoginScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error: '',
        };
    }

    render() {

        const { navigate } = this.props.navigation;

        const validateLogin = () => {
            // Validate login credentials
            if (this.state.username == "" || this.state.password == "") {
                this.setState({error: "Username and password cannot be blank"});
                return false;

            } else {
                validData = {
                    "type": userType,
                    "username": this.state.username,
                    "password": this.state.password,
                };

                // POST username and password to database
                // TODO: start session/establish somehow that the user is logged in

                fetch(api + '/login', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(validData)
                }).then(response => {
                    if (response.status === 200) {
                        if (userType == 'requester') {
                            navigate('Requester');
                        } else if (userType == 'mover') {
                            navigate('Mover');
                        }
                    } else {
                        console.log(response);
                        throw new Error('Something went wrong on api server!');
                    }
                });

                return true;
            }
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
                    onChangeText={(text) => this.setState({username: text})}
                />
                <TextInput
                    style={{height: 40, width: 200, margin:10, width: "90%", textAlign: 'center'}}
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(text) => this.setState({password: text})}
                />
                <TouchableOpacity
                    onPress={() => validateLogin()}
                    style={styles.bigButton}
                ><Text style={{color: "#fff", fontSize: 20}}>Log In</Text></TouchableOpacity>
                <Text style={styles.errorText}> { this.state.error }</Text>
            </View>
        );
    }
}

class GetCodeScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            phoneError: '',
        };
    }

    render() {

        const { navigate } = this.props.navigation;

        const validatePhone = () => {
            // Validate phone number
            this.setState({phoneError: validateInt("Phone", this.state.phone, 10)}, () => {
                if (this.state.phoneError == "") {

                    const validData = {"phone": this.state.phone};

                    // Send SMS to validated number
                    fetch(api + '/profile', {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(validData)
                }).then(response => {
                    if (response.status === 200) {
                        navigate("EnterCode");
                    } else {
                        console.log(response);
                        throw new Error('Something went wrong on api server!');
                    }
                });
                }
                return false;
            });


        };

        return (
            <View style={styles.container}>
                <Text
                    style={{fontSize:20, color: "#666", textAlign: 'center', margin: 10}}
                >Please validate your phone number</Text>

                <View style={{height: 100, margin: 20}}>
                <TextInput
                    style={{height: 40, width: 200, textAlign: 'center'}}
                    placeholder="Enter Phone Number"
                    onChangeText={(text) => {
                        this.setState({
                            phone: getPhoneFromInput(text),
                        });
                    }}
                /><Text style={[styles.errorText, {textAlign: 'center'}]}>{ this.state.phoneError }</Text>
                </View>

                <TouchableOpacity
                    onPress={() => validatePhone()}
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
                ><Text style={{color: "#fff", fontSize: 20}}>I&apos;ll Do This Later</Text></TouchableOpacity>

            </View>
        );
    }
}

class EnterCodeScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            code: '',
            codeError: '',
        };
    }

    render() {
        const {navigate} = this.props.navigation;

        const validateCode = () => {
            // Validate code sent by SMS
            this.setState({codeError: validateStr("Code", this.state.code, 100)}, () => {
                if (this.state.codeError == "") {

                    const validData = {"code": this.state.code};

                    // Send SMS to validated number
                    fetch(api + '/verify', {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(validData)
                    }).then(response => {
                        if (response.status === 200) {
                            if (userType == 'requester') {
                                validatedPhone = true;
                                navigate('Requester');
                            } else {
                                validatedPhone = true;
                                navigate('Mover');
                            }
                        } else {
                            console.log(response);
                            throw new Error('Something went wrong on api server!');
                        }
                    });
                }
                return false;
            });
        };

        return (
            <View style={styles.container}>
                <Text
                    style={{fontSize: 30, color: "#666", textAlign: 'center', margin: 10}}
                >Thanks for entering your phone.</Text>
                <Text
                    style={{fontSize: 20, color: "#666", textAlign: 'center', margin: 10}}
                >We have sent you a validation code. Please enter it below.</Text>
                <View>
                    <TextInput
                        style={{height: 40, width: 200, margin: 30, textAlign: 'center'}}
                        placeholder="Enter Code"
                        onChangeText={(text) => {
                            this.setState({code: text});
                        }}
                    /><Text style={styles.errorText}>{this.state.codeError}</Text>
                </View>

                <TouchableOpacity
                    onPress={() => validateCode()}
                    style={styles.bigButton}
                ><Text style={{color: "#fff", fontSize: 20}}>Validate</Text></TouchableOpacity>
            </View>
        );
    }
}


/*--Requester Screens--*/
// These screens are only visible to requesters:
// 1. RequestFormScreen: Form to place a request for a new moving job
// 2. MoverList: List of movers who have placed offers on a request
// 3. MoverListScreen: Container that holds the MoverList (necessary for navigation)
// 4. MoverDetailScreen: View details about a mover
// 5. ReviewScreen: Leave a star-review for a mover

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

            // TODO: POST validated form data to DB
        };

        return (
            <ScrollView>

                <View style={styles.container}>

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

                    <View style={styles.grayHeader}>
                        <Text style={styles.h1}>Submit a new job request</Text>
                    </View>

                    <TextInput
                        style={styles.formField}
                        placeholder="Start Address"
                        onChangeText={(text) => this.setState({startAddress: text})}
                    />
                    <TextInput
                        style={styles.formField}
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
                        style={styles.formField}
                        placeholder="Maximum Price"
                        onChangeText={(text) => this.setState({maximumPrice: text})}
                    />
                    <TextInput
                        style={styles.formField}
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
            // TODO: GET mover data
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

                <ScrollView style={{height: 400}}>
            <FlatList
                data={this.state.data}
                style={{width: "100%"}}

                renderItem={({item}) => (
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("ViewMover", {moverInfo: item.values})}>

                    <View style={{width: "90%", paddingTop: 20, paddingBottom: 20, flexDirection: "row", alignItems: "flex-start"}}>
                        <Image source={item.values.photo} style={{width: 80, height: 80}}/>
                        <View style={{marginLeft: 16}}>
                        <Text style={{fontSize: 16, fontWeight: "bold", color: "#333"}}>{item.values.name}</Text>
                            <Text>Offering ${item.values.price}</Text>
                            <Text>Starts at {item.values.startTime.getHours()}:{item.values.startTime.getMinutes()}</Text>
                            <Text>{item.values.rating}/5 Stars</Text>
                        </View>
                    </View>
                    </TouchableOpacity>
                )}
            />
                </ScrollView>
                <View style={[styles.grayFooter, {height: 100}]}>
                        <Text style={{height: 40, margin:10}}>Refresh List</Text>
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

    render() {
        const { navigate } = this.props.navigation;

        const acceptOffer = () => {
            this.setState({preAccept: "none", postAccept: "flex"});
            // TODO: update DB to reflect offer is accepted
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
            // TODO: POST rating to DB
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


/*--Profile Screen--*/
// Where user can update their profile. Visible to movers and requesters.
class ProfileScreen extends React.Component {
    static navigationOptions = {
        tabBarLabel: 'Profile',
    };

    constructor(props) {
        super(props);
        this.state = {
            // TODO: get profile data from DB
            data: {
                firstName: "Joe",
                lastName: "McMover",
                profilePhoto: require("./img/jeff.png"),
                username: "joemcmover89",
                password: "12345",
                zipCode: "10044",
                vehicle: "Large box truck",
                payments: "Cash"
            },

            // If the user changes anything, it will be stored here
            updatedData: {
                firstName: null,
                lastName: null,
                profilePhoto: null,
                username: null,
                password: null,
                zipCode: null,
                vehicle: null,
                payments: null
            }
        }
    }

    render() {
        const { navigate } = this.props.navigation;
        const isMover = userType == 'mover' ? true : false;

        const updateProfile = () => {
            // TODO: Validate form and post data to DB
            return true;
        };

        const cancelUpdateProfile = () => {
            // TODO: Revert all fields to original state
            return true;
        };

        const updateProfilePhoto = () => {
            // TODO: allow new image to be uploaded
            alert("Tapping photo will trigger prompt to upload new photo");
        };

        return (
                <ScrollView>
                    <View style={styles.container}>

                        <View style={styles.grayHeader}>
                            <Text style={styles.h1}>{this.state.data.firstName}&apos;s Profile</Text>
                        </View>

                    <Text
                        style={{display: validatedPhone ? 'none' : 'flex',
                            width: "100%",
                            backgroundColor: "yellow",
                            padding: 5,
                            marginTop: 0,
                            textAlign: 'center'
                        }}
                        onPress={() => navigate('GetCode')}
                    >Phone not yet validated. Tap here to validate phone</Text>
                    <View style={{flex:0, flexDirection: "row", justifyContent: "space-between", width: "90%"}}>
                        <TouchableOpacity onPress={() => updateProfilePhoto()}>
                            <Image source={this.state.data.profilePhoto} style={{marginTop: 20, width: 100, height: 100}}/>
                        </TouchableOpacity>
                        <View style={{width: "80%", alignItems: 'flex-start', marginLeft: 20}}>
                            <TextInput
                                style={[styles.formField, {width: "79%"}]}
                                placeholder="First Name"
                                defaultValue={this.state.data.firstName}
                                onChangeText={(text) => this.setState({updatedData: {firstName: text}})}
                            />
                             <TextInput
                                style={[styles.formField, {width: "79%"}]}
                                placeholder="Last Name"
                                defaultValue={this.state.data.lastName}
                                onChangeText={(text) => this.setState({updatedData: {lastName: text}})}
                             />
                        </View>
                    </View>
                    <TextInput
                        style={styles.formField}
                        placeholder="Username"
                        defaultValue={this.state.data.username}
                        onChangeText={(text) => this.setState({updatedData: {username: text}})}
                    />
                    <TextInput
                        style={styles.formField}
                        placeholder="Password"
                        secureTextEntry={true}
                        defaultValue={this.state.data.password}
                        onChangeText={(text) => this.setState({updatedData: {password: text}})}
                    />
                    <TextInput
                        style={[styles.formField, {display: isMover ? 'flex' : 'none'}]}
                        placeholder="Zip Code"
                        defaultValue={this.state.data.zipCode}
                        onChangeText={(text) => this.setState({updatedData: {zipCode: text}})}
                    />
                    <TextInput
                        style={[styles.formField, {display: isMover ? 'flex' : 'none'}]}
                        placeholder="Vehicle Type"
                        defaultValue={this.state.data.vehicle}
                        onChangeText={(text) => this.setState({updatedData: {vehicle: text}})}
                    />
                    <TextInput
                        style={[styles.formField, {display: isMover ? 'flex' : 'none'}]}
                        placeholder="Payment Types Accepted"
                        defaultValue={this.state.data.payments}
                        onChangeText={(text) => this.setState({updatedData: {payments: text}})}
                    />

                    <View style={styles.grayFooter}>
                        <TouchableOpacity
                             onPress={() => updateProfile()}
                            style={styles.bigButton}
                        ><Text style={{color: "#fff", fontSize: 20}}>Save Changes</Text></TouchableOpacity>

                        <Text
                            onPress={() => cancelUpdateProfile()}
                        >Cancel</Text>
                    </View>
                </View>
                </ScrollView>
        );
    }
}


/* -- Mover Screens --*/
// These screens are only visible to movers:
// 1. JobList: the list of available jobs submitted by requesters; nested inside JobListScreen
// 2. JobListScreen: screen containing the list of available jobs
// 3. JobDetailScreen: view details of a specific job; ability to place an offer

class JobList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [
                // TODO: GET available jobs from database
                // Jobs should be:
                //   - Within a certain distance of the mover (e.g. 10mi)
                //   - End time is before the current time
                //   - Ordered by distance
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

        const refreshJobs = () => {
            // TODO: GET available jobs from DB
            // Same selection criteria and sorting parameters as above
        };

        return(
            <View style={styles.containerTop}>

            <View style={styles.grayHeader}>
                <Text style={styles.h1}>{this.state.data.length} jobs are available{this.state.data.length > 0 ? "!" : " :("}</Text>
            </View>

                <ScrollView style={{height: 400, width: "90%"}}>
            <FlatList
                data={this.state.data}
                style={{width: "100%"}}

                renderItem={({item}) => (

                    <TouchableOpacity onPress={() => this.props.navigation.navigate("JobDetail", {jobInfo: item.values})}>

                    <View style={{width: "90%", paddingTop: 20, paddingBottom: 20, flexDirection: "row", alignItems: "flex-start"}}>
                        <Image source={item.values.photo} style={{maxWidth: 80, maxHeight: 60}}/>
                        <View style={{marginLeft: 10}}>
                        <Text style={{fontSize: 16, fontWeight: "bold", color: "#333"}}>{item.values.description}</Text>
                            <Text>Max ${item.values.maxPrice}</Text>
                            <Text>Start at {item.values.startTime}</Text>
                        </View>
                    </View>

                    </TouchableOpacity>
                )}
            />
                </ScrollView>
                <View style={styles.grayFooter}>
                    <View style={{flex:0, alignItems: "center", width: "90%"}}>
                        <Text
                            style={{height: 40, margin:10}}
                            onPress={() => refreshJobs() }
                        >Refresh List</Text>
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

// Nested navigator: https://reactnavigation.org/docs/intro/nesting
JobListScreen.router = JobList.router;

class JobDetailScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.navigation.state.params.jobInfo, // Data about the job, passed from JobListScreen
            preAccept: "flex", // Style before the offer has been placed
            postAccept: "none", // Style after the offer has been placed
            offerAmount: null, // Input amount offered
            offerTime: null, // Input start time offered
        }
    }

    render() {
        const { navigate } = this.props.navigation;

        const placeOffer = () => {
            // TODO: validate offer
            //   - Amount must be numeric and less than requester's max amount
            //   - Start time must be between requester's start time and end time

            // TODO: POST validated offer to DB

            this.setState({preAccept: "none", postAccept: "flex"});
        };

        return (
            <ScrollView>
            <View style={{flex: 1, justifyContent: "space-between", marginTop: 24}}>

                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff"}}>

                    <Image source={this.state.data.photo} style={{width: "100%", height:100}}/>

                    <View style={styles.jobDetailRow}>

                        <Text style={styles.jobDetailDesc}>Description</Text>
                        <Text style={styles.jobDetailInfo}>{this.state.data.description}</Text>

                    </View>

                    <View style={[styles.jobDetailRow, {flexDirection: 'row'}]}>
                        <View style={{width: "50%"}}>

                            <Text style={styles.jobDetailDesc}>Max Price</Text>
                            <Text style={styles.jobDetailInfo}>{this.state.data.maxPrice}</Text>

                        </View>

                        <View>

                            <Text style={styles.jobDetailDesc}>Other offers</Text>
                            <Text style={styles.jobDetailInfo}>$x - $y</Text>

                        </View>
                    </View>

                    <View style={[styles.jobDetailRow, {flexDirection: 'row', borderBottomWidth: 0}]}>
                        <View style={{width: "50%"}}>

                            <Text style={styles.jobDetailDesc}>Start time</Text>
                            <Text style={styles.jobDetailInfo}>{this.state.data.startTime}</Text>

                            <Text style={styles.jobDetailDesc}>End time</Text>
                            <Text style={styles.jobDetailInfo}>{this.state.data.endTime}</Text>

                        </View>
                        <View>

                            <Text style={styles.jobDetailDesc}>Start address</Text>
                            <Text style={styles.jobDetailInfo}>{this.state.data.startAddress}</Text>

                            <Text style={styles.jobDetailDesc}>End address</Text>
                            <Text style={styles.jobDetailInfo}>{this.state.data.endAddress}</Text>

                        </View>
                    </View>

                </View>

                <View style={[styles.grayFooter, {display: this.state.preAccept}]}>
                    <View style={{flex:0, flexDirection: "row", width: "90%",  padding: 10}}>
                        <View style={{width: "50%"}}>
                            <Text style={styles.jobDetailDesc}>Offer Amount ($)</Text>
                        <TextInput style={styles.formField}
                            placeholder="e.g. 100.00"
                            onChange={(text) => this.setState({offerAmount: text})}
                        />
                        </View>
                        <View style={{width: "50%"}}>
                            <Text style={styles.jobDetailDesc}>Start Time</Text>
                        <TextInput style={styles.formField}
                            placeholder="e.g. 1:00pm"
                            onChange={(text) => this.setState({offerTime: text})}
                        />
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => placeOffer() } style={styles.bigButton}>
                        <Text style={{color: "#fff", fontSize: 20}}>Place Offer</Text>
                    </TouchableOpacity>

                    <Text
                        style={{margin:20, fontSize:16, color: "#666"}}
                        onPress={() => navigate("JobList")}
                    >View Other Jobs</Text>
                </View>

                <View style={[styles.grayFooter, {display: this.state.postAccept}]}>
                    <Text
                        style={{margin:10, fontSize:30, color: "#00796B"}}
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


// StackNavigator: a registry of all screens in the app
// Requester and mover both have a nested TabNavigator that contains their screens
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
    }, {
        tabBarPosition: 'bottom',
        tabBarOptions: {
            style: {
                backgroundColor: '#666',
            }
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
    }, {
        tabBarPosition: 'bottom',
        tabBarOptions: {
            style: {
                backgroundColor: '#666',
            }
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
        marginTop: 24,
    },
    containerTop: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        marginTop: 24,
    },
    grayHeader: {
        backgroundColor: "#e8e8e8",
        width: "100%",
        padding: 20,
        flex: 0,
        alignItems: 'center',
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
        width: "90%",
        margin:10,
        fontSize:24,
        color: "#666",
        textAlign: 'center'
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
    },
    jobDetailDesc: {
        fontSize: 12,
        fontWeight: 'bold',
        alignItems: 'flex-start'
    },
    jobDetailInfo: {
        fontSize: 18,
        marginBottom: 10,
        alignItems: 'flex-start'
    },
    jobDetailRow: {
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#999"
    },
    formField: {
        height: 40,
        width: "90%",
        marginTop:10,
        marginBottom:10,
    },
    errorText: {
        color: '#b20808',
        fontSize: 10,
    }


});

export default App;