
'use strict';
var fs = require('fs');
var Q = require('q');
var readFile = Q.denodeify(fs.readFile);
var exists = Q.denodeify(fs.exists);
var readFileSync = fs.readFileSync;
var writeFile = Q.denodeify(fs.writeFile);

class slow{
    constructor(path){
        this.object = {};
        if(path){
            exists(path).then(
             function(success){
                 this.path = path;
                try {
                    this.object = slow.parse(readFileSync(path));
                }catch(e){
                    if (e instanceof SyntaxError) e.message = 'Malformed JSON in file: ' + file + '\n' + e.message;
                    throw e;
                }
             },
                function (error) {
                    this.path = path;
                    fs.writeFileSync(this.path, '', 'utf8');
                }
            );
        }else {
            throw new Error('there is certain problem with the path');
        }
    }

    save(){
        if(this.path != undefined){
            return slow.writeJson(this.path, this.object);
        }
    }

    saveSync(){
        if(this.path != undefined){
            slow.writeJsonSync(this.path, this.object);
        }
    }


    delete(){
        function deleteImages(req){
            var item = req.body;
            //var isSaveAction = (req.baseUrl == '/save');//如果baseUrl 是 /save, 则需要分裂.否则不需要

            // ImageSet.items[item.id] = item;

            var temp_item =  ImageSet.items.find(function (element) {
                return element.id === item.id;
            });


            if(temp_item != undefined){//如果找到的话,先删后加
                // console.log('这是找到的item: '+ temp_item.id);
                let index = ImageSet.items.indexOf(temp_item);
                ImageSet.items.splice(index, 1);












            }else {
                return Q.fcall(function () {
                    throw new Error("the file does not exist");
                });
            }

            // ImageSet.items.unshift(item);
            //console.log(ImageSet);

            //ImageSet.key = "new value";




            /*

             var buffer;
             var data = JSON.stringify(ImageSet, null, 2);
             console.log('data is ' + data);
             buffer = new Buffer(data, 'utf8');
             */
            //var promise = writeFile(realPathOfImageSetJson+'imageSet.json', buffer);




            var promise = writeJson(realPathOfImageSetJson+'imageSet.json', ImageSet);
            return promise.then(
                function (success) {

                    let promises = [];

                    promises.push(splitImageSetAndSaveBy20Albums(ImageSet, item.id));
                    promises.push(deleteSingleAlbum(item));

                    return Q.all(promises).then(
                        function(success){
                            return {
                                status: true,
                                id: item.id
                            };
                        },
                        function(error){
                            throw new Error('error happens when saving files');
                        }
                    );


                },
                function (error){
                    console.log(error);

                    throw new Error('error happens when saving '+item.id, item.id);
                }
            );
            /*
             return promise.then(
             function(success){
             return {
             status: true,
             id: newsFile.metaData.id
             };
             },
             function (error) {
             console.log(error);

             throw new Error('error happens when saving '+newsFile.name, newsFile.id);
             }
             );

             */
        }

    }

    search(){

    }




    static stringify(obj) {
    return JSON.stringify(obj, null, 2)
};

    static parse(str) {
    return JSON.parse(str)
};



    static writeJson(path, obj){
    var data = slow.stringify(obj);
    var buffer = new Buffer(data, 'utf8');
    var promise = writeFile(path, buffer);
    return promise;
}

    static writeJsonSync(path, obj){
        fs.writeFileSync(path, slow.stringify(obj), 'utf8');
    }

}

module.exports = slow;