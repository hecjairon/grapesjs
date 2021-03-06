var StorageManager = require('storage_manager');
var AssetManager = require('asset_manager');
var FileUploader = require('./view/FileUploader');

describe('Asset Manager', function() {

  describe('Main', function() {

    var obj;
    var imgObj;

    var storage;
    var storageId = 'testStorage';
    var storageMock = {
      store: function(data){
        storage = data;
      },
      load: function(keys){
        return storage;
      },
    };

    beforeEach(function () {
      imgObj = {
        type: 'image',
        src: 'path/to/image',
        width: 101,
        height: 102,
      };
      obj = new AssetManager();
      obj.init();
    });

    afterEach(function () {
      obj = null;
    });

    it('Object exists', function() {
      expect(obj).toExist();
    });

    it('No assets inside', function() {
      expect(obj.getAll().length).toEqual(0);
    });

    it('Add new asset', function() {
      obj.add(imgObj);
      expect(obj.getAll().length).toEqual(1);
    });

    it('Added asset has correct data', function() {
      obj.add(imgObj);
      var asset = obj.get(imgObj.src);
      expect(asset.get('width')).toEqual(imgObj.width);
      expect(asset.get('height')).toEqual(imgObj.height);
      expect(asset.get('type')).toEqual(imgObj.type);
    });

    it('Add asset with src', function() {
      obj.add(imgObj.src);
      var asset = obj.get(imgObj.src);
      expect(asset.get('type')).toEqual('image');
      expect(asset.get('src')).toEqual(imgObj.src);
    });

    it('Add asset with more src', function() {
      obj.add([imgObj.src, imgObj.src + '2']);
      expect(obj.getAll().length).toEqual(2);
      var asset1 = obj.getAll().at(0);
      var asset2 = obj.getAll().at(1);
      expect(asset1.get('src')).toEqual(imgObj.src);
      expect(asset2.get('src')).toEqual(imgObj.src + '2');
    });

    it('Src is unique', function() {
      obj.add(imgObj);
      obj.add(imgObj);
      expect(obj.getAll().length).toEqual(1);
    });

    it('Remove asset', function() {
      obj.add(imgObj);
      obj.remove(imgObj.src);
      expect(obj.getAll().length).toEqual(0);
    });

    it('Render assets', function() {
      obj.add(imgObj);
      expect(obj.render()).toExist();
    });

    describe('With storage', function() {

      var storageManager;

      beforeEach(function () {
        storageManager = new StorageManager().init({
          autoload: 0,
          type: storageId
        })
        obj = new AssetManager().init({
          stm: storageManager,
        });
        storageManager.add(storageId, storageMock);
      });

      afterEach(function () {
        storageManager = null;
      });

      it('Store and load data', function() {
        obj.add(imgObj);
        obj.store();
        obj.remove(imgObj.src);
        obj.load();
        var asset = obj.get(imgObj.src);
        expect(asset.get('width')).toEqual(imgObj.width);
        expect(asset.get('height')).toEqual(imgObj.height);
        expect(asset.get('type')).toEqual('image');
      });

    });

  });

  require('./model/Asset').run();
  require('./model/AssetImage').run();
  require('./model/Assets').run();

  require('./view/AssetView').run();
  require('./view/AssetImageView').run();
  require('./view/AssetsView').run();
  require('./view/FileUploader').run();
});
