// global namespace
var MyApp = MyApp || {};

// sub namespace
var MyApp.event = {};

// Container object for common method and properties
MyApp.commonMethod = {
    regExForName: "",  // define regex for name validation
    regExForPhone: "", // define regex for phone validation
    validateName: function(name) {
        // Do something with name. You can access 
        // regExForName variable using this.regExForName
        
    },
    validatePhoneNo: function(phoneNo) {
        // Do something with phone. You can access 
        // regExForPhone variable using this.regExForPhone
    }
}