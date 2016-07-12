var fs = require('fs'); // this engine requires the fs module
var contents = null ; 
var size = 0 ; 
var stack=[];
var options = null ; 
class Sky {
    constructor(filePath,options) {
        this.contents = fs.readFileSync(filePath, 'utf-8');
        this.size = this.contents.length ; 
        this.options = options ; 
        this.stack = [];  
    }
    getSize(){
       return this.size ;  
    }
    malloc(value){
        this.size+=value ;  
    }
    getProp(parm){
        return (this.options[parm]); 
    }
    add(block,skip){
        if(skip)
            return block ; 
        var temp = "<"+block+">" ;
        var stemp = temp.substring(0, temp.indexOf(' ')); 
        // Check if opening or closing # tage 
        if(temp == '<>'){
            return (this.stack.pop()); 
        }else if(stemp === ''){
            this.stack.push("</"+block+">"); 
            return (temp); 
        }else{
            this.stack.push(stemp.replace('<','</')+">");
            return (temp); 
        }
    }
    render(){
        var next='',count=0, block='', buffer='', skip=false ;
        while (null !== (next = this.contents[count++]) && count < this.getSize() && next !== undefined) {
            // html tag 
            if(next == '#'){
                // Read in the html tag block
                while(null !== (next = this.contents[count++])){
                    if(next ==='(' || next === ')'){
                        block+=' '; 
                        continue ; 
                    }
                    if(next ==='{'){
                        skip = true ; 
                        var obj=''; 
                        while(null !== (next = this.contents[count++])){
                            if(next === '}')
                                break ; 
                            obj+=next; 
                        }
                        block+=this.getProp(obj); 
                        continue ; 
                    }
                    if (!next.match(/[a-z]/i) && !next.match(/["'=]/gi) && !next.match(/^\d+$/))
                        break ; 
                    block+=next; 
                }
                buffer += this.add(block,skip); 
                block=''; 
                skip=false; 
            }
            // Extends tag
            else if(next == '@'){
                var file =''; 
                while(null !== (next = this.contents[count++])){
                    if (!next.match(/[a-z]/i))
                        break ; 
                    file+=next; 
                }
                // Load that file rendered text 
                // Load that file rendered text 
                var sky = new Sky('./views/'+file+'.sky',this.options); 
                this.malloc(sky.getSize()); 
                buffer += sky.render(); 
            }
            // Content
            else{
                buffer += next; 
            }
        }
        return(buffer); 
    }
    
    
}

module.exports = Sky ; 