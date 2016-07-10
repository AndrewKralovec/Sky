const fs = require('fs'); // this engine requires the fs module
const readline = require('readline');

module.exports = function (filePath,callback) {
    const readable = fs.createReadStream(filePath, {
        encoding: 'utf8',
        fd: null,
    });

    readable.on('readable', function() {
    var next='', block='', buffer='', stack=[];
        while (null !== (next = readable.read(1))) {
            if(next == '#'){
                // Read in the html tag block
                while(null !== (next = readable.read(1))){
                    if (!next.match(/[a-z]/i))
                        break ; 
                    block+=next; 
                }
                var temp = "<"+block+">" ;
                // Check if opening or closing # tage 
                if(temp == '<>'){
                    buffer += stack.pop(); 
                }else{
                    buffer += temp ;  
                    stack.push("</"+block+">"); 
                }
                block=''; 
            }else{
                buffer += next; 
            }
        }
        callback(null,buffer); 
    });
};