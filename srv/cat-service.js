const cds = require('@sap/cds');

module.exports = cds.service.impl(async (srv) => {
    srv.on('TestFunction', async (req, res) => {
        console.log('Custom Handler>>',req.req.data);
        console.log(req.req.file);
        // return 'TestFunction Triggered';
        req.reply({code: req.req.data.uploadResult.status, message: req.req.data.uploadResult});
    });

    srv.on('TestAction', async (req) => {
        console.log(req.req.data);
        console.log(req.data);
        return 'TestAction Triggered';
    });

});