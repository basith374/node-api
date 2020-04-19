import http from 'http';
import mysql from 'mysql';

const database = mysql.createConnection({
    'user': 'root',
    'password': 'pass',
    'database': 'database',
});

const db = {
    query: (query) => {
        return new Promise((resolve, reject) => {
            database.query(query, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            })
        })
    }
}

const utils = {
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
            });
            res.end(content, 'utf-8');
        }
    }
}

const query = {
    search: (req, res) => {
        let cb = utils.sendResponse(req, res);
        let ss = req.searchstr;
        
        Promise.all([
            db.query('select * from users where username like "%' + ss + '%"'),
            db.query('select * from apps where appname like "%' + ss + '%"'),
        ]).then(data => {
            console.log(data);
            let results = [];
            
            cb(null, data, 'foo');
        });
        // cb(null, {}, 'foo');
    },
}

const server = (req, res) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
        if (data) data = JSON.parse(data);
        if (req.url === '/api/search') {
            query.search(data, res);
        } else {
            res.writeHead(404);
            res.end('Not found', 'utf-8');
        }
    });
}

http.createServer(server).listen(10100);