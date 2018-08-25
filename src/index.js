/**
* 主模块文件
*/
import 'babel-polyfill';
import express from 'express';
import path from 'path';
import proxy from 'http-proxy-middleware';
import bodyParser from 'body-parser';

/**
 * 入口函数
 */
function main(...args) {
  let app = express();

  app.use('/content/static', express.static(path.resolve(__dirname, '../content/static')));
  // app.use('/static/static', express.static(path.resolve(__dirname, '../content/static')));
  // app.use('/static', express.static(path.resolve(__dirname, '../content/static')));

  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

  app.use('/webapi', proxy('/webapi', {
    target: 'http://www.bvt.vashare.com',
    changeOrigin: true
  }));

  app.get('/resortintro', function (req, res) {
    res.sendFile('index.html', {
      root: path.resolve(__dirname, '../content/')
    });
  });

  app.get('/', function (req, res) {
    res.sendFile('index.html', {
      root: path.resolve(__dirname, '../content/')
    });
  });

  app.post('/money/wechat/message/new', function (req, res) {
    console.log(req.body);
    let strMsg = req.body['MessageBody'];
    res.json({
      ['recieved message']: strMsg
    });
  });

  app.post('/money/wechat/contact/update', function (req, res) {
    console.log(req.body);
    let strMsg = req.body['MessageBody'];
    res.json({
      ['recieved contact']: strMsg
    });
  });

  let server = app.listen(3001, function () {
    let host = server.address().address;
    let port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
  });

	process.stdout.write('Hello world!\n');
}

/**
 * 缺省执行main函数
 */
main(...process.argv.slice(2));
