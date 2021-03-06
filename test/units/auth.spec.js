var assert = require("assert");
var config = require('./../config').app;
var weixin = require('./../../index');
var errors = require('web-errors').errors;


describe("Weixin Unit Test", function () {
  var signature;
  var timestamp = new Date();
  var nonce = 'sdfsdsdfsdf';

  it('should init', function(done){
    weixin.auth.init(config);
    done();
  });

  it('should be able to generate signature', function(done){
    timestamp = timestamp.getTime();
    signature = weixin.auth.generateSignature(config.appToken, timestamp, nonce);
    assert(!!signature);
    done();
  });

  it('should be able to check signature', function(done){
    var result = weixin.auth.check(signature, timestamp, nonce);
    assert(result);
    done();
  });

  it('should be able to generate params', function(done){
    var params = {
      a: 'b',
      c: 'd'
    };
    var result = weixin.restful.toParam(params, true);
    assert.equal(true, result === 'a=b&c=d');
    done();
  });

  it('should be able to marshall params', function(done){
    var params = {
      a: 'b',
      d: 'd',
      c: 'd',
      1: 'hello',

    };
    var result = weixin.auth.marshall(params);
    assert.equal(true, result === '1=hello&a=b&c=d&d=d');
    done();
  });

  it('should be able to get a pay signature', function(done){
    var params = {
      a: 'b',
      d: 'd',
      c: 'd',
      1: 'hello'
    };
    weixin.auth.merchant.init(1, 'aa', null);
    var result = weixin.auth.pay.sign(params);
    assert.equal(true, result === '19FEA8EEC24348FB8F9E10AA6FC97A03');
    done();
  });

  it('should be able to validate auth info ', function(done){
    var params = {}, result;
    weixin.auth.merchant.init(1, 'aa', null);
    result = weixin.auth.pay.validate(params);
    assert.equal(true, result === errors.ERROR);
    params = {
      appid: 'appid',
      mch_id: 'mch_id',
      device_info: 'device_info',
      nonce_str: 'nonce_str'
    };
    result = weixin.auth.pay.validate(params);

    assert.equal(true, result === errors.APP_ID_ERROR);

    params = {
      appid: weixin.auth.appId,
      mch_id: 'mch_id',
      device_info: 'device_info',
      nonce_str: 'nonce_str'
    };

    result = weixin.auth.pay.validate(params);
    assert.equal(true, result === errors.MERCHANT_ID_ERROR);

    params = {
      appid: weixin.auth.appId,
      mch_id: 1,
      device_info: 'device_info',
      nonce_str: 'nonce_str'
    };
    result = weixin.auth.pay.validate(params);

    assert.equal(true, result === true);
    var data = {};
    result = weixin.auth.pay.validate(data);
    assert.equal(true, result === errors.ERROR);
    data = weixin.auth.pay.prepare(data);
    result = weixin.auth.pay.validate(data);
    assert.equal(true, result === true);
    done();
  });
});

