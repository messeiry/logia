
if (Meteor.isClient) {

    Meteor.subscribe('links');
    Meteor.subscribe('sampleData');
    Meteor.subscribe('alarms');


    Template.report_tree.events({
        'click, .tree li.parent_li > a' : function (e){
            var children = $(e.target).parent('li.parent_li').find(' > ul > li');

            if (children.is(":visible")) {
                children.hide('fast');
                $(e.target).find(' > i').attr('class','glyphicon glyphicon-plus-sign')
            } else {
                children.show('fast');
                $(e.target).find(' > i').attr('class','glyphicon glyphicon-minus-sign')
            }
        }

    });

    Template.report.rendered = function (){
        getCharts()
        function getCharts(){
            var chart = nv.models.lineChart();

            for (var i=0;i<5;i++){
                $("<div id='chart"+i+"' class='chart half with-transitions'><svg></svg>").appendTo("#example-container");
            }

            Meteor.autorun(function() {
                //var data = sampleData.find().fetch();



                var data = [{"_id":"j7XRWhbyy82JQDwPF","color":"#4DBCE9","key":"Stream 1","values":[{"timestamp":1,"value1":1},{"timestamp":2,"value1":10},{"timestamp":3,"value1":15}]}]

                // loading the data for each chart
                for (var i=0;i<5;i++){
                    createChart(i);
                }

                function createChart(chartId){
                    nv.addGraph(function() {
                        //chartArray.push(chart)
                        chart.x(function(d,i) { return d.timestamp });
                        chart.y(function(d,i){ return d.value1 })

                        chart.xAxis // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
                            .tickFormat(d3.format(',.1f'))
                            .axisLabel("Time")
                        ;

                        chart.yAxis
                            .axisLabel('Numbers Comming from MongoDB')
                            .tickFormat(d3.format(',.4f'));

                        chart.showXAxis(true).showYAxis(true).rightAlignYAxis(true).margin({right: 50});

                        //chart.showLegend(true)

                        d3.select('#chart'+chartId+' svg')
                            .datum(data)
                            .transition().duration(100)
                            .call(chart);


                        nv.utils.windowResize(chart.update);

                        return chart;
                    });



                }


            })

        }


/*
        var x = 2;
        var run = true;
        setInterval(function(){
            if (!run) return;
            var spike = (Math.random() > 0.95) ? 10: 1;
            data[0].values.push({
                x: x,
                y: Math.random() * spike
            });
            if (data[0].values.length > 70) {
                data[0].values.shift();
            }
            x++;

            for(var i=0;i<chartArray.length;i++){
                chartArray[i].update();
            }
        }, 500);

        d3.select("#start-stop-button").on("click",function() {
            run = !run;
        });

*/














    }

    Template.root.rendered = function (){

        $("li.parent_li i").attr('class','glyphicon glyphicon-plus-sign');
        $("li.parent_li ul li").hide();

        $(".report-tree").resizable({
            handles : 'e',
            minWidth: '50',
            maxWidth: '300',
            resize: function (){
                $(".content").width($(this).parent().width() - $(this).width() - 30)
            }

        });

        // $(".datepicker").datepicker();

        $('.timepicker').datetimepicker();


    }

    Handlebars.registerHelper('report_list', function(){
        var lnk = ""
        lnks = Links.find()
        lvl = "-"
        uplvl = -1
        lvlno = 0

        ul = "<ul>"
        ulend = "</ul>"
        li = "<li class='parent_li'>"
        liend = "</li>"

        lnk += "<div class='tree'><ul>"
        getSubChilds("0")
        lnk += "<ul></div>"

        function getSubChilds(parentId){
            lvl +="-"
            lvlno +=1
            uplvl +=1
            for (var i=0; i<lnks.count();i++){

                if (lnks.db_objects[i].parent == parentId){
                    if (hasChilds(lnks.db_objects[i]._id) > 0){

                        lnk += li
                        lnk += '<a href="/report/'+lnks.db_objects[i]._id+'"><i class="glyphicon glyphicon-minus-sign"></i>  '+lnks.db_objects[i].name+'</a>'
                        lnk += ul
                        getSubChilds(lnks.db_objects[i]._id)
                        lnk += liend
                        lnk += ulend

                        lvl = lvl.substr(1)
                        lvlno -=1
                        uplvl -=1
                    }
                    else{

                        lnk += li
                        lnk += '<a href="/report/'+lnks.db_objects[i]._id+'"><i class="glyphicon glyphicon-minus-sign"></i>  '+lnks.db_objects[i].name+'</a>'
                        lnk += liend
                    }


                }


            }
        }


        function hasChilds(linkName){
            var count = 0
            for (var i=0; i<lnks.count();i++){
                if (linkName == lnks.db_objects[i].parent){
                    count ++
                }
            }
            return count
        }

        return new Handlebars.SafeString(lnk)
    })


    /******* Global Functions **********/

    function paginate(){
        var maxRows = 25;
        $('.console table').each(function() {
            var cTable = $(this);
            var cRows = cTable.find('tr:gt(0)');
            var cRowCount = cRows.size();

            if (cRowCount < maxRows) {
                return;
            }

            /**
             * loop in rows and display number
             cRows.each(function(i) {
                    $(this).find('td:first').text(function(j, val) {
                       return (i + 1) + "" + val;
                    });
                });
             */

            cRows.filter(':gt(' + (maxRows - 1) + ')').hide();


            var cPrev = cTable.siblings('.prev');
            var cNext = cTable.siblings('.next');

            cPrev.addClass('disabled');

            cPrev.click(function() {
                var cFirstVisible = cRows.index(cRows.filter(':visible'));

                if (cPrev.hasClass('disabled')) {
                    return false;
                }

                cRows.hide();
                if (cFirstVisible - maxRows - 1 > 0) {
                    cRows.filter(':lt(' + cFirstVisible + '):gt(' + (cFirstVisible - maxRows - 1) + ')').show();
                } else {
                    cRows.filter(':lt(' + cFirstVisible + ')').show();
                }

                if (cFirstVisible - maxRows <= 0) {
                    cPrev.addClass('disabled');
                }

                cNext.removeClass('disabled');

                return false;
            });

            cNext.click(function() {
                var cFirstVisible = cRows.index(cRows.filter(':visible'));

                if (cNext.hasClass('disabled')) {
                    return false;
                }

                cRows.hide();
                cRows.filter(':lt(' + (cFirstVisible +2 * maxRows) + '):gt(' + (cFirstVisible + maxRows - 1) + ')').show();

                if (cFirstVisible + 2 * maxRows >= cRows.size()) {
                    cNext.addClass('disabled');
                }

                cPrev.removeClass('disabled');

                return false;
            });

        });
    }

    function sorter(){
        $('.console table').each(function() {

            var $table = $(this);
            $('th', $table).each(function(column) {
                var $header = $(this);

                if ($header.hasClass('sort-alpha')) {
                    $header
                        .addClass('clickable')
                        .hover(
                        function() { $header.addClass('hover') },
                        function() { $header.removeClass('hover');
                        })
                        .click(function() {
                            $header.hasClass('asc')?
                                $header.removeClass('asc').addClass('desc'):
                                $header.removeClass('desc').addClass('asc');
                            var rows = $table.find('tbody > tr').get();

                            rows.sort(function(a, b) {
                                var keyA = $(a).children('td').eq(column).text().toUpperCase();
                                var keyB = $(b).children('td').eq(column).text().toUpperCase();

                                if (keyA > keyB) {
                                    return ($header.hasClass('asc')) ? 1 : -1;
                                }
                                if (keyA < keyB) {
                                    return ($header.hasClass('asc')) ? -1 : 1;
                                }
                                return 0;
                            });

                            $.each(rows, function(index, row) {
                                $table.find('tbody').append(row);
                            });
                        });
                }
            });
        });
    }
}