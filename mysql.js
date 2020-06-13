var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'taewon',
  password : 'taewon',
  database : 'project_7'
});
 
connection.connect();
 
connection.query('SELECT* FROM subject', function (error, results, fields) {
  if (error) {
      console.log(error);
  }

    console.log(results);
});
 
connection.end();