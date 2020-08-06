module.exports = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Reservac Backend Documentation',
      description:
        'Documentations of all routes and funtionality of reservac projects, you can try all routes in this documentations, see what parameters it needs and what is the response. this documentations is provider by Swagger-ui-express and swagger-jsdoc.',
      version: '1.0.0',
      contact: {
        email: 'jesuskauze@gmail.com'
      }
    }
  },
  basePath: '/api',
  apis: ['./src/routes/*', './src/swagger/*'],
  schemes: ['https', 'http']
};
