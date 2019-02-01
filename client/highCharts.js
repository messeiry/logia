

if (Meteor.isClient){

    Template.highcharts.rendered = function() {
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });

        for(var i=1;i<13;i++){
            $("#charts").append('<div id="ch'+i+'" class="highChartExample" style="width:430px;height:300px;float:left;"></div>')
            var chartTypeArr = ["spline","area","column","scatter"]
            var randomChartTypeId = Math.floor(Math.random() * 3) + 1
            var chartType = chartTypeArr[randomChartTypeId]

            getChart("#ch"+i, chartType)
        }


    }


    function getChart(chartId, chartType){
        var chart;
        $(chartId).highcharts({
            chart: {
                type: chartType,
                zoomType: 'xy',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: function() {
                        // set up the updating of the chart each second
                        var series = this.series[0];
                        setInterval(function() {
                            var x = (new Date()).getTime(), // current time
                                y = Math.random();
                            series.addPoint([x, y], true, true);
                        }, 1000);
                    }
                }
            },
            title: {
                text: 'Live random data'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.series.name +'</b><br/>'+
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Random data',
                data: (function() {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;

                    for (i = -19; i <= 0; i++) {
                        data.push({
                            x: time + i * 1000,
                            y: Math.random()
                        });
                    }
                    return data;
                })()
            }]
        });
    }



    Template.observe.rendered = function () {

        console.log("Observing Changes")

        count = 0
        var q = Alarms.find();
        count = q.count()
        var handle = q.observeChanges({
            added: function (){
                count++
                console.log("new record added " + count)
            },
            changed : function () {
                console.log("Updated")
            }

        })

    }

}



