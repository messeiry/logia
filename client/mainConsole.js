if (Meteor.isClient) {
    Template.zConsole.rendered = function () {
        Session.set("obj", getSearchSelector($('#searchTxt').val(), $('#startTimeTxt').val(), $('#endTimeTxt').val()))
        Deps.autorun(function (){
            Meteor.subscribe("dynamicAlarms", Session.get("obj"))
            //console.log("Count from AutoRun ==> " + Alarms.find(Session.get("obj")).count())
            var searchResult = Alarms.find(Session.get("obj")).fetch()
            $(".badge").html(searchResult.length)
            getConsole(searchResult, ".console")
            console.log("===>" + searchResult.length)
        })

    }
    Template.zConsole.events = {
        'click #searchBtn' : function () {
            Session.set("obj", getSearchSelector($('#searchTxt').val(), $('#startTimeTxt').val(), $('#endTimeTxt').val()))
        },
        'click .fixedSearch button' : function (e){
            var duration = $(e.target).attr("duration")
            var now = new Date()
            var from
            if (duration == "1h"){
                from = new Date(now - 60*60000)
            } else if (duration == "8h"){
                from = new Date(now - 60*8*60000)
            } else if (duration == "1d"){
                from = new Date(now - 60*24*60000)
            } else if (duration == "1w"){
                from = new Date(now - 60*24*7*60000)
            } else if (duration == "1M"){
                from = new Date(now - 60*24*7*4*60000)
            } else if (duration == "all"){
                from = new Date(now - 60*24*7*4*12*60000)
            } else{

            }
            Session.set("obj", getSearchSelector($('#searchTxt').val(), from, now))

        }
    }

    function getSearchSelector(searchBy, start, end){
        var searchObj = {}
        if (searchBy != "")
            searchObj = $.parseJSON("{"+searchBy+"}")

        searchObj['timestamp'] = {$gte: new Date(start) , $lt: new Date(end) }

        return searchObj
    }

    function getConsole(alarms, containerObjId){

        var str = "";
        str += "<table>"
        str += "<thead><th class='sort-alpha'>N#</th><th class='sort-alpha'>Alarm Name</th><th class='sort-alpha'>Element Name</th><th class='sort-alpha'>Instance Name</th><th class='sort-alpha'>Class Name</th><th class='sort-alpha'>Severity</th><th class='sort-alpha'>timestamp</th><th class='sort-alpha'>State</th></thead>"
        str += "<tbody>"

        for (var i= 0; i<alarms.length;i++){
            str += "<tr id="+alarms[i]._id+">"
            str += "<td id="+alarms[i]._id+"><a class='clear-alarm'><i class='glyphicon glyphicon-thumbs-up'></i></a>   " +
                "<a class='ack-alarm'><i class='glyphicon glyphicon-thumbs-down'></i></a>" +
                "</td>"
            str += "<td id="+alarms[i]._id+">"+alarms[i].EventName+"</td>"
            str += "<td id="+alarms[i]._id+">"+alarms[i].ElementName+"</td>"
            str += "<td id="+alarms[i]._id+">"+alarms[i].InstanceName+"</td>"
            str += "<td id="+alarms[i]._id+">"+alarms[i].ClassName+"</td>"
            str += "<td id="+alarms[i]._id+"><i class='glyphicon glyphicon-stop "+alarms[i].Severity+"'></i> "+alarms[i].Severity+"</td>"
            str += "<td id="+alarms[i]._id+">"+alarms[i].timestamp+"</td>"
            str += "<td id="+alarms[i]._id+" tooltip='"+alarms[i].State+"'><i class='"+alarms[i].State+" glyphicon glyphicon-stop'></i> "+alarms[i].State+"</td>"
            str += "</tr>"
        }

        str += "</tbody>"
        str += "</table>"
        // str += '<br /><span class="prev">Previous</span><span class="next">Next</span>'

        $("div"+ containerObjId).html(str);


        genPopup(alarms, containerObjId)
        alarmControls(containerObjId)
    }

    function alarmControls(){
        $('.clear-alarm').click(function (){
            Alarms.update({_id:$(this).parent('td').attr('id')}, {$set: {State: "Clear"}});
        })
        $('.ack-alarm').click(function (){
            Alarms.update({_id:$(this).parent('td').attr('id')}, {$set: {State: "Notify"}});
        })
    }

    function genPopup(alarms, containerObjId){
        $(containerObjId + " td").dblclick(function (e) {

            $(this).parent("tr").css('background-color','#d3f3f1')

            lastPopup = $(".console-popup").last().position()

            var popupContent = "";
            for (var i=0;i<alarms.length;i++){
                if (alarms[i]._id == $(this).attr('id')){
                    popupContent += "<br><h3>"+alarms[i].EventName+"</h3><br>"
                    popupContent += "<b>Alarm Time : </b>" + alarms[i].timestamp + "<br />"
                    popupContent += "<b>Alarm Name : </b>" + alarms[i].EventName + "<br />"
                    popupContent += "<b>Instance Name : </b>" + alarms[i].InstanceName + "<br />"
                    popupContent += "<b>Origin System : </b>" + alarms[i].OriginSys + "<br />"
                    popupContent += "<b>Sender System : </b>" + alarms[i].SenderSys + "<br />"
                    popupContent += "<b>Severity : </b>" + alarms[i].Severity + "<br />"
                    popupContent += "<b>Class Name : </b>" + alarms[i].ClassName + "<br />"
                    popupContent += "<b>Element Class Name : </b>" + alarms[i].ElementClassName + "<br />"
                    popupContent += "<b>Expiration in : </b>" + alarms[i].ExpireIn + "<br />"
                    popupContent += "<b>State : </b>" + alarms[i].State + "<br />"
                    popupContent += "<b>In Maintenance : </b>" + alarms[i].InMaintenance + "<br />"
                    popupContent += "<b>Event Text : </b>" + alarms[i].EventText + "<br />"
                    popupContent += "<b>Log File : </b>" + alarms[i].logfile + "<br />"
                    popupContent += "<b>User Defined 1 : </b>" + alarms[i].UD1 + "<br />"
                    popupContent += "<b>User Defined 2 : </b>" + alarms[i].UD2 + "<br />"
                    popupContent += "<b>User Defined 3 : </b>" + alarms[i].UD3 + "<br />"
                    popupContent += "<b>User Defined 4 : </b>" + alarms[i].UD4 + "<br />"
                    popupContent += "<b>User Defined 5 : </b>" + alarms[i].UD5 + "<br />"
                }
            }

            $(".console").append("<div class='console-popup' id='"+$(this).attr('id')+"'>" +
                "<a class='console-popup-close'><i class='glyphicon glyphicon-remove-sign'></i></a>" +
                "<b>Alarm Id:</b> " + $(this).attr('id') + "<br />"+
                popupContent
                +"</div>")

            try{
                $("div#"+$(this).attr('id')).css('left', lastPopup.left + 50).css('top', lastPopup.top + 50)
            }
            catch(err){
            }

            $(".console-popup-close").click(function (e) {
                $("tr#"+$(this).parent("div").attr('id')).css('background-color','#ffffff')
                $(this).parent("div").hide("fast");
            });

            $(".console-popup").mouseover(function (e) {
                $(".console-popup").css('z-index','999')
                $(this).css('z-index','9999')
            });


            $(".console-popup").draggable();

        });
    }

}