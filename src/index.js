/**
* 主模块文件
*/
import 'babel-polyfill';
import express from 'express';
import path from 'path';
import proxy from 'http-proxy-middleware';
import history from 'connect-history-api-fallback';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

/**
 * 入口函数
 */
function main(...args) {
  let app = express();

  app.use('/content/static', express.static(path.resolve(__dirname, '../content/static')));
  // app.use('/static/static', express.static(path.resolve(__dirname, '../content/static')));
  app.use('/promotion/static', express.static(path.resolve(__dirname, '../content/promotion/static')));
  app.use('/promotion/vendor', express.static(path.resolve(__dirname, '../content/promotion/vendor')));
  app.use('/promotion/babyfsmallcoupon', express.static(path.resolve(__dirname, '../content/promotion/babyfsmallcoupon')));
  app.use('/promotion/manifest', express.static(path.resolve(__dirname, '../content/promotion/manifest')));
  app.use('/promotion/demo', express.static(path.resolve(__dirname, '../content/promotion/demo')));

  app.use(cookieParser());
  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

  app.use('/webapi', proxy('/webapi', {
    target: 'http://www.bvt.vashare.com',
    changeOrigin: true
  }));
  app.use('/api', proxy('/api', {
    target: 'http://exchange.babyfs.cn',
    changeOrigin: true
  }));
  app.use('/op', proxy('/op', {
    target: 'http://op.dev.babyfs.cn',
    changeOrigin: true
  }));

  app.use('/cookie/sethttponly', function (req, res) {
    res.cookie('name','zhangsan',{maxAge: 900000, httpOnly: true, domain: '.fe.test.babyfs.cn'});
    res.json({
      isSuccess: true,
      message: ''
    });
  });

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

  app.get('/promotion/babyfsmallcoupon.html', function (req, res) {
    res.sendFile('babyfsMallCoupon.html', {
      root: path.resolve(__dirname, '../content/promotion/')
    });
  });

  app.get('/promotion/demo.html', function (req, res) {
    res.sendFile('demo.html', {
      root: path.resolve(__dirname, '../content/promotion/')
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

  app.get('/api/city/detail', function (req, res) {
    let id = req.query.id;
    res.json({
      success: true,
      code: 0,
      data: {
        cityId: 5,
        cityName: '上海',
        countryId: 6,
        countryName: '中国',
        code: 1002
      }
    });
  });

  let server = app.listen(3001, function () {
    // let host = server.address().address;
    let host = 'fe.test.babyfs.cn';
    let port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
  });

	process.stdout.write('Hello world!\n');
}

/**
 * 缺省执行main函数
 */
main(...process.argv.slice(2));
