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
    - index.js (with index.html)
        ```
        const server = http.createServer((req, res) => {
        
            console.log(`Request for ${req.url} by method ${req.method}`);

            if (req.method == 'GET') {
                var fileUrl;
                if (req.url == '/') fileUrl = '/index.html';
                else fileUrl = req.url;

                var filePath = path.resolve('./public' + fileUrl);
                const fileExt = path.extname(filePath);
                if (fileExt == '.html') {
                    fs.exists(filePath, (exists) => {
                        if (!exists) {
                            res.statusCode = 404;
                            res.setHeader('Content-Type', 'text/html');
                            res.end(`<html><body><h1>Error 404: ${fileUrl} not found</h1></body></html>`);
                        
                            return;
                        }
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'text/html');
                        fs.createReadStream(filePath).pipe(res);
                    })
                }
                else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/html');
                    res.end(`<html><body><h1>Error 404: ${fileUrl} not an HTML file</h1></body></html>`);
                    
                    return;
                }
            }
            else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/html');
                res.end(`<html><body><h1>Error 404: ${req.method} not supported</h1></body></html>`);

                return;
            }
        })

        server.listen(port, hostname, () => {
            console.log(`Server running at http://${hostname}:${port}`)
        })
        ```
4. Using postman in the development of APIs
5. Express.js as web framework and morgan for logging
    - index.js
        ```
        const app = express();

        app.use((req, res, next) => {
            console.log(req.headers);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end('<html><body><h1>This is an Express server</h1></body></html>');
        });

        const server = http.createServer(app);

        server.listen(port, hostname, () => {
            console.log(`Server running at http://${hostname}:${port}`)
        });
        ```