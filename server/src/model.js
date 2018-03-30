var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'twzxy123',
  database : 'stockMessage',
});
 
connection.connect();
 
connection.query('SELECT *from message', function(err, rowsDatas) {
    if (err) {
        throw err;
    }
 
    rowsDatas.forEach(rowData => {
        console.log(rowData.message);
    });
});