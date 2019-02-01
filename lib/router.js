/*** Handles Routing ****/
Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function() { return Meteor.subscribe('sampleData') }
})

Router.map(function() {
    this.route('main', {path: '/'});



    this.route('highcharts', {path: '/highcharts'});
    this.route('observe', {path: '/observe'});

    this.route('report', {
        path: '/report/:_id',
        data: function (){
             //return this.params._id;
        }
    });

    this.route('zConsole', {
        path : '/zConsole'
    })

})