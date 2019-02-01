/**
 * Created by messeiry on 3/16/14.
 */
if (Meteor.isServer) {

    /**
     * PUBLISH FUNCTIONS
     */
    Meteor.publish('links', function(){
        return Links.find()
    })

    Meteor.publish('sampleData', function(){
        return sampleData.find()
    })

    Meteor.publish('data', function(){
        return data.find()
    })

    Meteor.publish('alarms', function(){
        return Alarms.find();
    })

    Meteor.publish('dynamicAlarms',function (searchObj) {
        return Alarms.find(searchObj)
    })

    /**
     * StARTUP
     */
    Meteor.startup(function () {

        // code to run on server at startup
        if (Links.find().count() <= 0){
            links.insert({name: "rep 2", parent: "0"})
        }

        if (sampleData.find().count() <= 0){
            //insert sample data :
            sampleData.insert({ key: "Stream 1", color: "#4DBCE9", values: [ {x: 1, y: 1}, {x: 2, y: 4}, {x: 3, y: 2}]});
            //sampleData.insert({ key: "Stream 2", color: "#D1E751", values: [ {x: 1, y: 2}, {x: 2, y: 5}]});
        }

    });


    Meteor.methods({
        clearAlarm: function(alarmId) {
            // Alarms.update({_id: alarmId }, {$set: {State: "Clear"}});
        }
    })

// END SERVER
}



