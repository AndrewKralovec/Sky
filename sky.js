const fs = require('fs'); // this engine requires the fs module
const readline = require('readline');

module.exports = function (filePath) {
var next='', buffer='', tag=false;
    const readable = fs.createReadStream(filePath, {
        encoding: 'utf8',
        fd: null,
    });

    readable.on('readable', function() {
        while (null !== (next = readable.read(1))) {
            if(next == '#'){
                if(tag){
                    buffer+='>';
                }else{
                    buffer+='<';
                }
                tag = !tag ; 
            }else{
                buffer += next; 
            }
        }
        console.log(buffer); 
    });
};