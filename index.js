// let ejs = require('ejs');
const express = require('express')
const swagger_app = express()
// const swaggerUi = require('swagger-ui-express');
const path = require('path');
swagger_app.set('view engine', 'ejs');
swagger_app.set('views', __dirname + '/public/swagger');
// swagger_app.engine('html', ejs.renderFile);
const swaggerDocument = require(process.cwd()+'/swagger.json');

// swagger_app.get('/',swaggerUi.serve,swaggerUi.setup(swaggerDocument));
swagger_app.get('/swagger',(req,res)=>{
    res.render('index',{"spec":JSON.stringify(swaggerDocument)});
});

swagger_app.use('/', express.static(path.join(__dirname, 'public')))

/**Task Pending:if file is in yaml convert it to json */

/**public swagger files */

swagger_app.listen(8080, () => console.log('Swagger mai aapka swagat hai port 8080'));

