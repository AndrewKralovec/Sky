const fs = require('fs'); // this engine requires the fs module
const readline = require('readline');

module.exports = function (filePath,options,callback) {
    var stack=[];
    
    const add = function(block,skip){
        if(skip)
            return block ; 
        var temp = "<"+block+">" ;
        var stemp = temp.substring(0, temp.indexOf(' ')); 
        // Check if opening or closing # tage 
        if(temp == '<>'){
            return (stack.pop()); 
        }else if(stemp === ''){
            stack.push("</"+block+">"); 
            return (temp); 
        }else{
            stack.push("</"+stemp+">"); 
            return (temp); 
        }
    }; 
    const getProp = function(parm){
        return (options[parm]); 
    }; 
    const readable = fs.createReadStream(filePath, {
        encoding: 'utf8',
        fd: null,
    });

    readable.on('readable', function() {
        var next='', block='',buffer='',skip=false; 
        while (null !== (next = readable.read(1))) {
            // html tag 
            if(next == '#'){
                // Read in the html tag block
                while(null !== (next = readable.read(1))){
                    if(next ==='(' || next === ')'){
                        block+=' '; 
                        continue ; 
                    }
                    if(next ==='{'){
                        skip = true ; 
                        var obj=''; 
                        while(null !== (next = readable.read(1))){
                            if(next === '}')
                                break ; 
                            obj+=next; 
                        }
                        block+=getProp(obj); 
                        continue ; 
                    }
                    if (!next.match(/[a-z]/i) && !next.match(/["'=]/gi))
                        break ; 
                    block+=next; 
                }
                buffer += add(block,skip); 
                block=''; 
                skip=false; 
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