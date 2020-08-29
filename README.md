# Nodejs, Express and MongoDB

1. Define a node module
    - rectangle.js
        ```
        exports.area = (x, y) => (x*y);
        ```
    - index.js
        ```
        var rect = require('./rectangle')
        rect.area(x, y)
        ```
2. Define a callback function
    - rectangle.js
        ```
        module.exports = (x, y, callback) => {
            if ( x <= 0 || y <= 0) {
                setTimeout(() => 
                    callback(new Error(`Rectangle dimensions should be greater than zero: l = ${x} and b = ${y}`),
                    null)
                    , 2000);
            }
            else {
                setTimeout(() => callback(null, 
                        {
                            perimeter: () => (2*(x+y)),
                            area: () => (x*y)
                        }
                    ), 2000);
            }
        }
        ```
    - index.js
        ```
        rect(l, b, (err, rectangle) => {
            if (err) {
                console.log(`ERROR: ${err.message}`)
            }
            else {
                console.log(`The area of the rectangle of dimensions l = ${l} and b = ${b} is ${rectangle.area()}`)
                console.log(`The perimeter of the rectangle of dimensions l = ${l} and b = ${b} is ${rectangle.perimeter()}`)
            }
        });
        ```
3. Build a simple HTTP Server
    - index.js
        ```
        const http = require('http');

        const hostname = 'localhost';
        const port = 3000;

        const server = http.createServer((req, res) => {
            console.log(req.headers);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end('<html><body><h1>Hello World!</h1></body></html>')
        })

        server.listen(port, hostname, () => {
            console.log(`Server running at http://${hostname}:${port}`)
        })
        ```