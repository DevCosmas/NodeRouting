const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');
const port = 8000;
const hostname = 'localhost';
const dataPath = path.join(__dirname, 'items.json');

const requestHandler = (req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  if (pathname === '/api' && req.method === 'GET') {
    fs.readFile(dataPath, 'utf-8', (err, data) => {
      if (err) {
        console.log('error in reading file');
      }
      const dataObj = JSON.parse(data);
      res.writeHead(200, { 'Content-type': 'application/json' });
      res.end(JSON.stringify(dataObj));
    });
  }
  // Using the GET http method for one
  if (pathname.startsWith('/api/') && req.method === 'GET') {
    const id = req.url.split('/')[2];
    fs.readFile(dataPath, 'utf-8', (err, data) => {
      if (err) {
        console.log('error in reading file');
      }
      const dataObj = JSON.parse(data);
      const objIndex = dataObj.findIndex((obj) => obj.id === id);
      if (objIndex === -1) {
        res.writeHead(404);
        res.end('NOT FOUND!');
      } else {
        const obj = dataObj[objIndex];
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(JSON.stringify(obj));
      }
    });
  }
  // Using the POST http method
  if (pathname === '/api' && req.method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    });
    req.on('end', () => {
      const bufferData = Buffer.concat(body).toString();
      const jsonBuffer = JSON.parse(bufferData);
      fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) console.log('an error occured');
        const dataObj = JSON.parse(data);
        const lstId = dataObj[dataObj.length - 1].id;
        const newId = parseInt(lstId) + 1;
        const parsedId = newId.toString();
        const newData = Object.assign(jsonBuffer, { id: parsedId });
        dataObj.push(newData);
        const final = JSON.stringify(dataObj);
        fs.writeFile(dataPath, final, (err) => {
          if (err) console.log('an error occured');
          console.log('file is written');
        });
        res.end();
      });
    });
  }
  // Using the UPDATE http method
  if (pathname.startsWith('/api/') && req.method === 'PATCH') {
    const id = req.url.split('/')[2];
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    });
    req.on('end', () => {
      const bufferData = Buffer.concat(body).toString();
      const parsedBuffer = JSON.parse(bufferData);
      fs.readFile(dataPath, 'utf-8', (err, data) => {
        if (err) console.log('error occured');
        const jsonFile = JSON.parse(data);
        const findIndex = jsonFile.findIndex((file) => file.id === id);
        const updated = (jsonFile[findIndex] = {
          ...jsonFile[findIndex],
          ...parsedBuffer,
        });
        console.log(updated);
        jsonFile[findIndex] = updated;
        fs.writeFile(dataPath, JSON.stringify(jsonFile), (err) => {
          if (err) console.log('not permitted');
          console('file successfully updated');
        });
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end('UPDATE COMPLETE');
      });
    });
  }
  // Using the DELETE http method
  if (pathname.startsWith('/api/') && req.method === 'DELETE') {
    const id = req.url.split('/')[2];
    fs.readFile(dataPath, 'utf-8', (err, data) => {
      if (err) console.log('error occured');
      const jsonFile = JSON.parse(data);
      const findIndex = jsonFile.findIndex((file) => file.id === id);
      jsonFile.splice(findIndex, 1);
      fs.writeFile(dataPath, JSON.stringify(jsonFile), (err) => {
        if (err) console.log('not permitted');
        console('file successfully deleted');
      });
      res.writeHead(200, { 'Content-type': 'application/json' });
      res.end('DELETE COMPLETE');
    });
  }
};
const apiServer = http.createServer(requestHandler);
apiServer.listen(port, hostname, () => {
  console.log(`server is running successfully at port ${port}`);
});
