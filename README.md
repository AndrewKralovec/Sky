## Synopsis
Sky is being developed as a javascript template engine. The goal of sky is to implement key features left out by major template engines. 
## Code Example

Replace opening and close tags `<tag></tag>` with a simple single opening/closing tag `#tag#`  
Id's need to be defined via parameters  `<tag id="myId">` to ` #tag(id="myId")`  
Render objects like `res.render('index', { message: 'Hello there!'});` in page with ` #{message}")`  
Extend pages with `@fileName' tag


