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
            // html tag 
            if(next == '#'){
                // Read in the html tag block
                while(null !== (next = readable.read(1))){
                    if(next ==='(' || next === ')'){
                        block+=' '; 
                        continue ; 
                    }
                    if (!next.match(/[a-z]/i) && !next.match(/["'=]/gi))
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
            }
            // Extends tag
            else if(next == '@'){
                var file =''; 
                while(null !== (next = readable.read(1))){
                    if (!next.match(/[a-z]/i))
                        break ; 
                    file+=next; 
                }
                // Load that file rendered text 
            }
            // Content
            else{
                buffer += next; 
            }
        }
        callback(null,buffer); 
    });
};