# logia
Developed by Mohamed ELMesseiry 
m.messeiry@gmail.com

Logia is a sample implimentation of monitoring solution which uses push instead of pull for presenting metrices in realtime. 

the code is written in NodeJs using the Meteor Framework and MongoDB as a Backend TimeSeries Database. 

Mongo is not by nature a TSDB but the current architecture is tweeking the design to be used in such a way. 

HighCharts is used as a charting components, that basically get updated by JavaScript binding to the Server Port. 

there is also an implimentation of realtime alarms that is been handled by the same setup.

Enjoy.


