import React, { Component } from 'react';
import { Button, StyleSheet, Text, TextInput, ScrollView, View, Alert, FlatList, Image, TouchableHighlight, TouchableOpacity} from 'react-native';
import { StackNavigator, TabNavigator, TabView} from 'react-navigation';
import DateTimePicker from 'react-native-modal-datetime-picker';

var userType; // either mover or requester
var validatedPhone = false; // keep track of whether phone has been validated
var api = "http://127.0.0.1:8080";
var jobId = null; // Current job id; null if no current job

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

const validatePrice = (label, price) => {
    i = sanitizeInput(price);
    if (!(i)) {
        return label + " cannot be blank";
    } else if (!(/^\d+\.?\d{0,2}$/.test(i))) {
        return label + " must be a number";
    } else {
        return "";
    }
}

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

// Given input, returns the response body as JSON
// There may be a better way to do this
const parseResponseBody = (response) => {
    return JSON.parse(JSON.parse(JSON.stringify(response._bodyInit)));
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
                    }, credentials: 'same-origin',
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
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        credentials: 'same-origin',
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
                            console.log(JSON.stringify(response));
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
            activeField: null,
            submitted: false,

            startAddressError: '',
            endAddressError: '',
            startTimeError: '',
            endTimeError: '',
            maximumPriceError: '',
            descriptionError: '',

            allErrors: '',
        };
    }

    render() {
        const { navigate } = this.props.navigation;

        const validateForm = () => {

            // Validate job

            this.setState({
                startAddressError: validateStr("Start address", this.state.startAddress, 100),
                endAddressError: validateStr("End address", this.state.endAddress, 100),
                startTimeError: validateStr("Start time", this.state.startTime, 50),
                endTimeError: validateStr("End time", this.state.endTime, 50),
                maximumPriceError: validatePrice("Max price", this.state.endTime, 50),
                descriptionError: validateStr("Description", this.state.description, 500),
            }, () => {

                if (this.state.startAddressError == ""
                    && this.state.endAddressError == ""
                    && this.state.startTimeError == ""
                    && this.state.endTimeError == ""
                    && this.state.maximumPriceError == ""
                    && this.state.descriptionError == ""
                ) {

                    const validData = {
                        "start_time": this.state.startTime,
                        "end_time": this.state.endTime,
                        "start_address": this.state.startAddress,
                        "end_address": this.state.endAddress,
                        "max_price": this.state.maximumPrice,
                        "description": this.state.description,
                    };

                    // POST new job to database

                    fetch(api + "/jobs", {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(validData)
                    }).then(response => {
                        if (response.status === 200) {
                            jobId = response._bodyInit;
                            this.setState({submitted: true});
                            navigate("MoverList");
                        } else {
                            alert(JSON.stringify(response));
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

                    <View style={styles.formField}>
                        <Text style={styles.jobDetailDesc}>Start Address</Text>
                    <TextInput
                        style={{ display: this.state.submitted ? "none" : "flex" }}
                        placeholder="1 Main St, Anytown, NY, 10101"
                        onChangeText={(text) => this.setState({startAddress: text})}
                    /><Text style={styles.errorText}>{ this.state.startAddressError } </Text>
                        <Text style={{ display: this.state.submitted ? "flex" : "none" }}>{ this.state.startAddress } </Text>
                    </View>

                    <View style={styles.formField}>
                        <Text style={styles.jobDetailDesc}>End Address</Text>
                    <TextInput
                        style={{ display: this.state.submitted ? "none" : "flex" }}
                        placeholder="1 Main St, Anytown, NY, 10101"
                        onChangeText={(text) => this.setState({endAddress: text})}
                    /><Text style={styles.errorText}>{ this.state.endAddressError } </Text>
                        <Text style={{ display: this.state.submitted ? "flex" : "none" }}>{ this.state.endAddress } </Text>
                     </View>

                    <View style={{flex:0, flexDirection: "row", justifyContent: "space-between", width: "90%"}}>
                        <View style={{height: 40, width: "45%", marginTop:10, marginBottom:10}}>
                            <Text style={styles.jobDetailDesc}>Start Time</Text>
                        <TextInput
                            style={{ display: this.state.submitted ? "none" : "flex" }}
                            placeholder="1:00pm"
                            onFocus={() => this.setState({timePickerVisible: true, activeField: "startTime"})}
                            onChangeText={(text) => this.setState({startTime: text})}
                        /><Text style={styles.errorText}>{ this.state.startTimeError } </Text>
                            <Text style={{ display: this.state.submitted ? "flex" : "none" }}>{ this.state.startTime } </Text>
                        </View>

                        <View style={{height: 40, width: "45%", marginTop:10, marginBottom:10}}>
                            <Text style={styles.jobDetailDesc}>End Time</Text>
                        <TextInput
                            style={{ display: this.state.submitted ? "none" : "flex" }}
                            placeholder="6:00pm"
                            onFocus={() => this.setState({timePickerVisible: true, activeField: "endTime"})}
                            onChangeText={(text) => this.setState({endTime: text})}
                        /><Text style={styles.errorText}>{ this.state.endTimeError } </Text>
                            <Text style={{ display: this.state.submitted ? "flex" : "none" }}>{ this.state.endTime } </Text>
                        </View>
                    </View>

                    <View style={styles.formField}>
                        <Text style={styles.jobDetailDesc}>Maximum Price</Text>
                    <TextInput
                        style={{ display: this.state.submitted ? "none" : "flex" }}
                        placeholder="500.00"
                        onChangeText={(text) => this.setState({maximumPrice: text})}
                    /><Text style={styles.errorText}>{ this.state.maximumPriceError } </Text>
                        <Text style={{ display: this.state.submitted ? "flex" : "none" }}>{ this.state.maximumPrice } </Text>
                    </View>

                    <View style={styles.formField}>
                        <Text style={styles.jobDetailDesc}>Description of the job</Text>
                    <TextInput
                        style={{ display: this.state.submitted ? "none" : "flex" }}
                        placeholder="Volume of items, type of items, etc"
                        onChangeText={(text) => this.setState({description: text})}
                    /><Text style={styles.errorText}>{ this.state.descriptionError } </Text>
                        <Text style={{ display: this.state.submitted ? "flex" : "none" }}>{ this.state.description } </Text>
                    </View>

                    <Text style={{height: 40, width: "90%", margin:10}}>📷 Upload Photos</Text>

                    <View style={styles.grayFooter}>
                        <TouchableOpacity

                            onPress={() => validateForm() ? navigate('Movers') : false}
                            style={[styles.bigButton, {display: this.state.submitted ? "none" : "flex" }]}
                        ><Text style={{color: "#fff", fontSize: 20}}>Find Movers</Text></TouchableOpacity>

                        <View style={{display: this.state.submitted ? "flex" : "none", alignItems: "center"}}>
                        <Text style={{margin:10, fontSize:20, color: "#00796B" }}>Job Submitted Successfully!</Text>
                        <Text style={{marginTop:10, margin: 20, marginBottom: 30, fontSize:14, color: "#666"}}>Check the movers list to see if any movers have placed an offer.</Text>
                        </View>
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
            data: []
        }
    }

    componentDidMount() {
        if (jobId) {
            fetch(api + "/getOffers/" + jobId, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }, credentials: 'same-origin',
            }).then(response => {
                if (response.status === 200) {
                    response = parseResponseBody(response);
                    responsedata = [];
                    for (var i = 0; i < response.length; i++) {
                        responsedata.push({
                            "key": i,
                            "values": response[i]
                        });
                    }
                    this.setState({data: responsedata});
                } else {
                    throw new Error('Something went wrong on api server!');
                }
            });
        }
    }

    render() {

        const refreshList = () => {
            if (jobId) {
                fetch(api + "/getOffers/" + jobId, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    }, credentials: 'same-origin',
                }).then(response => {
                    if (response.status === 200) {
                        response = parseResponseBody(response);
                        this.setState({data: response});
                    } else {
                        throw new Error('Something went wrong on api server!');
                    }
                });
            }
        };

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
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("ViewMover", {offerData: item.values})}>

                    <View style={{width: "90%", paddingTop: 20, paddingBottom: 20, flexDirection: "row", alignItems: "flex-start"}}>
                        { /* <Image source={item.values.photo} style={{width: 80, height: 80}}/> */ }
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
                    <TouchableOpacity
                        onPress={() => refreshList()}
                    >
                        <Text style={{height: 40, margin:10}}>Refresh List</Text>
                    </TouchableOpacity>
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
            offerData: this.props.navigation.state.params.offerData,
            moverData: [],
            accepted: false,
        }
    }

    componentDidMount() {
        // Get mover's profile
        // TODO: return the mover's profile data along with job data, so this request will not be necessary
        fetch(api + "/profile/" + this.state.offerData.userId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }, credentials: 'same-origin',
        }).then(response => {
            if (response.status === 200) {
                response = parseResponseBody(response);
                this.setState({moverData: response});
            } else {
                throw new Error('Something went wrong on api server!');
            }
        });
    }

    render() {
        const { navigate } = this.props.navigation;

        const acceptOffer = () => {
            // TODO: update DB to reflect offer is accepted
        };

        return (

            <View style={{flex: 1, justifyContent: "space-between"}}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff"}}>
                    { /* <Image source={this.state.data.photo} style={{marginTop: 50, width: 100, height: 100}}/> */ }
                    <Text style={{
                        height: 30,
                        width: "90%",
                        margin:10,
                        fontSize:20,
                        color: "#666",
                        textAlign: 'center'
                    }}>{this.state.moverData.first_name + " " + this.state.moverData.last_name}</Text>
                    <Text style={{margin:20, fontSize:16}}>${this.state.offerData.price} |
                        Start at {this.state.offerData.start_time} |
                        {this.state.data.rating}/5 Stars</Text>
                    <Text style={{margin:10, fontSize:16}}>Phone: {this.state.moverData.phone}</Text>
                    <Text style={{margin:10, fontSize:16}}>Drives: {this.state.moverData.vehicle}</Text>
                    <Text style={{margin:10, fontSize:16}}>Accepts: {this.state.moverData.payment}</Text>
                </View>

                <View style={[styles.grayFooter, {display: this.state.accepted ? "none" : "flex"}]}>
                    <TouchableOpacity
                            onPress={() => acceptOffer() }
                            style={styles.bigButton}
                        ><Text style={{color: "#fff", fontSize: 20}}>Accept Offer</Text></TouchableOpacity>
                    <Text
                        style={{margin:30, fontSize:16, color: "#666"}}
                        onPress={() => navigate("MoverList")}
                    >View Other Offers</Text>
                </View>


                <View style={[styles.grayFooter, {display: this.state.accepted ? "flex" : "none"}]}>
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
            // TODO: get profile photo as well
            firstName: "",
            lastName: "",
            profilePhoto: require("./img/jeff.png"),
            username: "",
            password: "",
            zipCode: "",
            vehicle: "",
            payments: "",

            // If the user changes anything, it will be stored here
            newFirstName: null,
            newLastName: null,
            newProfilePhoto: null,
            newUsername: null,
            newPassword: null,
            newZipCode: null,
            newVehicle: null,
            newPayments: null
        }
    }

    componentDidMount() {
            fetch(api + "/profile", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }, credentials: 'same-origin',
        }).then(response => {
            if (response.status === 200) {
                response = parseResponseBody(response);
                this.setState({
                        firstName: response.first_name,
                        lastName: response.last_name,
                        username: response.username,
                        password: response.password,
                        zipCode: response.zipcode,
                        vehicle: response.vehicle,
                        payments: response.payment,
                });
                validatedPhone = response["verified_phone"];

            } else {
                throw new Error('Something went wrong on api server!');
            }
        });
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
            this.setState({
                firstName: this.state.first_name,
                lastName: this.state.last_name,
                username: this.state.username,
                password: this.state.password,
                zipCode: this.state.zipcode,
                vehicle: this.state.vehicle,
                payments: this.state.payment,
            });
        };

        const updateProfilePhoto = () => {
            // TODO: allow new image to be uploaded
            alert("Tapping photo will trigger prompt to upload new photo");
        };

        return (
                <ScrollView>
                    <View style={styles.container}>

                        <View style={styles.grayHeader}>
                            <Text style={styles.h1}>{this.state.firstName}&apos;s Profile</Text>
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
                            <Image source={this.state.profilePhoto} style={{marginTop: 20, width: 100, height: 100}}/>
                        </TouchableOpacity>
                        <View style={{width: "80%", alignItems: 'flex-start', marginLeft: 20}}>
                            <TextInput
                                style={[styles.formField, {width: "79%"}]}
                                placeholder="First Name"
                                defaultValue={this.state.firstName}
                                onChangeText={(text) => this.setState({newFirstName: text})}
                            />
                             <TextInput
                                style={[styles.formField, {width: "79%"}]}
                                placeholder="Last Name"
                                defaultValue={this.state.lastName}
                                onChangeText={(text) => this.setState({newLastName: text})}
                             />
                        </View>
                    </View>
                    <TextInput
                        style={styles.formField}
                        placeholder="Username"
                        defaultValue={this.state.username}
                        onChangeText={(text) => this.setState({newUsername: text})}
                    />
                    <TextInput
                        style={styles.formField}
                        placeholder="Password"
                        secureTextEntry={true}
                        defaultValue={this.state.password}
                        onChangeText={(text) => this.setState({newPassword: text})}
                    />
                    <TextInput
                        style={[styles.formField, {display: isMover ? 'flex' : 'none'}]}
                        placeholder="Zip Code"
                        defaultValue={this.state.zipCode}
                        onChangeText={(text) => this.setState({newZipCode: text})}
                    />
                    <TextInput
                        style={[styles.formField, {display: isMover ? 'flex' : 'none'}]}
                        placeholder="Vehicle Type"
                        defaultValue={this.state.vehicle}
                        onChangeText={(text) => this.setState({newVehicle: text})}
                    />
                    <TextInput
                        style={[styles.formField, {display: isMover ? 'flex' : 'none'}]}
                        placeholder="Payment Types Accepted"
                        defaultValue={this.state.payments}
                        onChangeText={(text) => this.setState({newPayments: text})}
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
            data: [],
                // TODO:
                // Jobs should be:
                //   - Within a certain distance of the mover (e.g. 10mi)
                //   - End time is before the current time
                //   - Ordered by distance
        }
    }

    componentDidMount() {
        fetch(api + "/jobs", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }, credentials: 'same-origin',
        }).then(response => {
            if (response.status === 200) {
                response = parseResponseBody(response);
                responsedata = [];
                for (var i = 0; i < response.length; i++) {
                    responsedata.push({
                        "key": i,
                        "values": response[i]
                    });
                }
                this.setState({data: responsedata});
            } else {
                throw new Error('Something went wrong on api server!');
            }
        });
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

                    <TouchableOpacity onPress={() => this.props.navigation.navigate("JobDetail", {jobId: item.values._id["$oid"]})}>

                    <View style={{width: "90%", paddingTop: 20, paddingBottom: 20, flexDirection: "row", alignItems: "flex-start"}}>
                        { /* <Image source={item.values.photo} style={{maxWidth: 80, maxHeight: 60}}/> */ }
                        <View style={{marginLeft: 10}}>
                        <Text style={{fontSize: 16, fontWeight: "bold", color: "#333"}}>{item.values.description}</Text>
                            <Text>Max ${item.values.max_price}</Text>
                            <Text>Start at {item.values.start_time}</Text>
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
            jobId: this.props.navigation.state.params.jobId, // Data about the job, passed from JobListScreen
            placed: false,
            offerAmount: "", // Input amount offered
            offerTime: "", // Input start time offered
            data: [],
            otherOffers: "None yet!",

            timeError: "",
            amountError: "",

        }
    }

    componentDidMount() {
        fetch(api + "/jobs/" + this.state.jobId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }, credentials: 'same-origin',
        }).then(response => {
            if (response.status === 200) {
                response = parseResponseBody(response);
                this.setState({data: response});

            } else {
                throw new Error('Something went wrong on api server!');
            }
        });


        fetch(api + "/getOffers/" + this.state.jobId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }, credentials: 'same-origin',
        }).then(response => {
            if (response.status === 200) {
                response = parseResponseBody(response);
                var offers = [];
                if (response.length > 0) {
                    for (var i = 0; i < response.length; i++) {
                        offers.push(parseFloat(response[i]['price']));
                    }
                    if (offers.length > 1) {
                        this.setState({otherOffers: "$" + Math.min.apply(Math, offers) + " - $" + Math.max.apply(Math, offers)});
                    } else {
                        this.setState({otherOffers: "$" + offers[0]})
                    }
                }
            } else {
                throw new Error('Something went wrong on api server!');
            }
        });
    }

    render() {
        const { navigate } = this.props.navigation;

        const placeOffer = () => {
            this.setState({
                // TODO: validate offer better
            //   - Amount must be numeric and less than requester's max amount
            //   - Start time must be between requester's start time and end time
                amountError: validatePrice("Offer", this.state.offerAmount),
                timeError: validateStr("Time", this.state.offerTime, 10),
            }, () => {
                if (this.state.amountError == "" && this.state.timeError == "") {
                    const offer = parseFloat(this.state.offerAmount);
                    const validData = {
                        "job_id": this.state.jobId,
                        "price": offer,
                        "start_time": this.state.offerTime,
                    };
                    fetch(api + "/addOffer", {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }, credentials: 'same-origin',
                        body: JSON.stringify(validData),
                    }).then(response => {
                        if (response.status === 201) {
                            this.setState({placed: true});
                        } else {
                            throw new Error('Something went wrong on api server!');
                        }
                    });
                } else {
                    return false;
                }
            });
        };

        return (
            <ScrollView>
            <View style={{flex: 1, justifyContent: "space-between", marginTop: 24}}>

                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff"}}>

                    { /*<Image source={this.state.data.photo} style={{width: "100%", height:100}}/> */ }

                    <View style={styles.jobDetailRow}>

                        <Text style={styles.jobDetailDesc}>Description</Text>
                        <Text style={styles.jobDetailInfo}>{this.state.data.description}</Text>

                    </View>

                    <View style={[styles.jobDetailRow, {flexDirection: 'row'}]}>
                        <View style={{width: "50%"}}>

                            <Text style={styles.jobDetailDesc}>Max Price</Text>
                            <Text style={styles.jobDetailInfo}>${this.state.data.max_price}</Text>

                        </View>

                        <View>

                            <Text style={styles.jobDetailDesc}>Other offers</Text>
                            <Text style={styles.jobDetailInfo}>{this.state.otherOffers}</Text>

                        </View>
                    </View>

                    <View style={[styles.jobDetailRow, {flexDirection: 'row', borderBottomWidth: 0}]}>
                        <View style={{width: "50%"}}>

                            <Text style={styles.jobDetailDesc}>Start time</Text>
                            <Text style={styles.jobDetailInfo}>{this.state.data.start_time}</Text>

                            <Text style={styles.jobDetailDesc}>End time</Text>
                            <Text style={styles.jobDetailInfo}>{this.state.data.end_time}</Text>

                        </View>
                        <View>

                            <Text style={styles.jobDetailDesc}>Start address</Text>
                            <Text style={styles.jobDetailInfo}>{this.state.data.start_address}</Text>

                            <Text style={styles.jobDetailDesc}>End address</Text>
                            <Text style={styles.jobDetailInfo}>{this.state.data.end_address}</Text>

                        </View>
                    </View>

                </View>

                <View style={[styles.grayFooter, {display: this.state.placed ? "none" : "flex"}]}>
                    <View style={{flex:0, flexDirection: "row", width: "90%",  padding: 10}}>
                        <View style={{width: "50%"}}>
                            <Text style={styles.jobDetailDesc}>Offer Amount ($)</Text>
                        <TextInput style={styles.formField}
                            placeholder="e.g. 100.00"
                            onChangeText={(text) => this.setState({offerAmount: text})}
                        />
                            <Text style={styles.errorText}>{this.state.amountError}</Text>
                        </View>
                        <View style={{width: "50%"}}>
                            <Text style={styles.jobDetailDesc}>Start Time</Text>
                        <TextInput style={styles.formField}
                            placeholder="e.g. 1:00pm"
                            onChangeText={(text) => this.setState({offerTime: text})}
                        /><Text style={styles.errorText}>{this.state.timeError}</Text>
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

                <View style={[styles.grayFooter, {display: this.state.placed ? "flex" : "none"}]}>
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