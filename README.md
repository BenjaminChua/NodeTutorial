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
    - index.js (static pages)
        ```
        const app = express();

        app.use(morgan('dev'));
        app.use(express.static(__dirname + '/public'));

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
6. Express.js REST API & Body Parser
    - index.js
        ```
        app.use(bodyParser.json());

        app.get('/dishes', (req, res, next) => {
            res.end('Will send all the dishes to you!');
        });

        app.post('/dishes/:dishID', (req, res, next) => {
            res.statusCode = 403;
            res.end(`POST operation not supported on /dishes/${req.params.dishID}`);
        });

        app.put('/dishes/:dishID', (req, res, next) => {
            res.write(`Updating the dish: ${req.params.dishID} \n`);
            res.end(`Will update the dish: ${req.body.name} with details: ${req.body.description}`);
        });
        ```
7. Express.js REST API, Body Parser & Express Router
    - index.js
        ```
        const dishRouter = require('./routes/dishRouter');

        app.use('/dishes', dishRouter);
        ```
    - dishRouter.js
        ```
        const dishRouter = express.Router();
        dishRouter.use(bodyParser.json());

        dishRouter.route('/')
            .all((req, res, next) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                next();
            })
            .get((req, res, next) => {
                res.end('Will send all the dishes to you!');
            });

        module.exports = dishRouter;
        ```
8. Express generator REST API
    ```
    sudo npm install -g express-generator
    ```
    ```
    express conFusionServer
    ```
9. MongoDB
    - Create database
        ```
        mkdir data
        ```
    - Init database
        ```
        mongod --dbpath=data --bind_ip 127.0.0.1
        ```
    - Access Mongo server in default port 27017
        ```
        mongo
        ```
        - Create/Connect to new DB conFusion
            ```
            use conFusion
            ```
        - Help
            ```
            db.help()
            ```
        - Insert record into dishes collection in conFusion DB
            ```
            db.dishes.insert({"name": "Uthappizza", "description": "Test"});
            ```
        - Pretty print all documents in dishes collection
            ```
            db.dishes.find().pretty()
            ```
        - Get ISO datetime from ObjectId
            ```
            var id = new ObjectId()
            id.getTimestamp()
            ```
10. MongoDB driver
    - Init database
        ```
        mongod --dbpath=data --bind_ip 127.0.0.1
        ```
    - Install mongoDB driver & assert
        ```
        npm install --save mongodb assert
        ```
11. Mongoose
    - Init database
        ```
        mongod --dbpath=data --bind_ip 127.0.0.1
        ```
    - Install mongoose
        ```
        npm install --save mongoose
        ```
12. Using cookies and express sessions for Basic Auth
13. Using local authentication: passport, passport-local and passport-local-mongoose for user auth
    ```
    npm install --save passport passport-local passport-local-mongoose
    ```
14. Token based authentication without sessiions: jsonwebtoken and passport-jwt
    ```
    npm install --save jsonwebtoken passport-jwt
    ```
15. Mongoose population for auto population of user info for each comment in dishes
16. Changing a user to admin directly from the database
    ```
    mongo
    ```
    ```
    use conFusion
    ```
    ```
    db.users.update({"username": "admin"}, {$set: {"admin": true}})
    ```
17. Generate a self-signed ssl cert and private key for local development
    ```
    openssl genrsa 1024 > private.key
    openssl req -new -key private.key -out cert.csr
    openssl x509 -req -in cert.csr -signkey private.key -out certificate.pem
    ```
18. Using Multer for uploading of files
    ```
    npm install --save multer
    ```