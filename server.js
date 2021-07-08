const server = require('http').createServer((req, res) => {
  res.writeHead(200).end('<B>GARUDA is online</B>');
});

function keepAlive(){
    server.listen(3000, ()=>{console.log("Server is Ready!")});
}
module.exports = keepAlive;
