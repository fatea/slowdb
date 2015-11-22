
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


    find(id, col){
    //well, I don't think there should be any async find...
    }


    findSync(id, col){
        if(col == undefined){
            return null;
        }else {
            var temp_item =  this[col].find(function (element) {
                return element['id'] === id;
            });

            if(temp_item != undefined){
                return temp_item;
            }else {
                return null;
            }
        }
    }



    insert(obj, col) {
        if(col == undefined){
            return Q.fcall(function () {
                throw new Error("the col is needed");
            });
        }else{
            if(obj.id == undefined){
                return Q.fcall(function(){
                    throw new Error('the obj does not have an id');
                })
            }

            var temp_item =  this[col].find(function (element) {
                return element['id'] ===obj.id;
            });


            if(temp_item == undefined){
                this[col].unshift(obj);

                return this.save();
            }else {
                return Q.fcall(function () {
                    throw new Error("the file does not exist");
                });
            }
        }

    }


    insertSync(obj, col){

    }

    update(id, obj, col){
            if(col == undefined){

                return Q.fcall(function () {
                    throw new Error("the col is needed");
                });

        }else{

            var temp_item =  this[col].find(function (element) {
                return element['id'] === id;
            });


            if(temp_item != undefined){//如果找到的话,先删后加
                // console.log('这是找到的item: '+ temp_item.id);
                let index = this[col].indexOf(temp_item);
                this[col].splice(index, 1);
                this[col].unshift(obj);

                return this.save();
            }else {
                return Q.fcall(function () {
                    throw new Error("the file does not exist");
                });
            }
        }


    }

    updateSync(id, col, key, value){

    }


    delete(id, col){
        if(col == undefined){
            var temp =  this[id];
            if(temp != undefined){//如果找到的话,先删后加
                delete this[id];
            }else {
                return Q.fcall(function () {
                    throw new Error("the file does not exist");
                });
            }
        }else{

            var temp_item =  this[col].find(function (element) {
                return element[key] === key;
            });


            if(temp_item != undefined){//如果找到的话,先删后加
                // console.log('这是找到的item: '+ temp_item.id);
                let index = this[col].indexOf(temp_item);
                this[col].splice(index, 1);
            }else {
                return Q.fcall(function () {
                    throw new Error("the file does not exist");
                });
            }
    }
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