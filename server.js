let http = require('http');
let mysql = require('mysql');
let database = mysql.createConnection({
    'host': 'host',
    'user': 'root',
    'password': 'pass',
    'database': 'database',
});

let db = {
    query: (query) => {
        return new Promise((resolve, reject) => {
            database.query(query, (err, rows) => {
                if(err) return reject(err);
                resolve(rows);
            })
        })
    }
}

let utils = {
    sendResponse: (req, res) => {
        return (err, data, msg) => {
            let content = JSON.stringify(err ? {
                err,
                data: null,
                msg,
            } : {
                err: null,
                data,
                msg,
            });
            res.writeHead(err ? 400 : 200, {
                'Content-Type': 'application/json',
            }, );
            res.end(content, 'utf-8');
        }
    }
}

let search = {
    list: (req, res) => {
        let cb = utils.sendResponse(req, res);
        let ss = req.searchstr;
        
        Promise.all([
            db.query('select * from users where username like "%' + ss + '%"'),
            db.query('select * from apps where appname like "%' + ss + '%"'),
        ]).then(data => {
            // console.log(rsp);
            let results = [];
            
            cb(null, results, 'foo');
        });
        // cb(null, {}, 'foo');
    }
}

let server = (req, res) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
        if(data) data = JSON.parse(data);
        if(req.url === '/api/search') {
            search.list(data, res);
        } else {
            res.writeHead(404);
            res.end('Not found', 'utf-8');
        }
    });
}

http.createServer(server).listen(10100);