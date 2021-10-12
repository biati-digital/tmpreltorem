//import GLightbox from './src/js/glightbox.js';
const GLightbox = require('./dist/js/glightbox-umd.js');
//const { Glightbox } = require('./dist/js/glightbox-umd.js');
//const { GlightboxInit } = require('./dist/js/glightbox-umd.js');

console.log(GLightbox);
//console.log(glightbox);
/*console.log(GlightboxInit);
GLightbox({
    hulk: 'Hogan'
});*/
//console.log(GLightbox.GLightbox.default());

/*GLightbox({
    hulk: 'Hogan'
});*/

module.exports = (opts = {}) => {
    console.log('process 1');
    console.log('unwanted line from main');
    console.log('we are done nows');
};
