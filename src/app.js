const fs = require("fs");
const request = require('request');

function deployArtifact(action, settings){
    const urlParts = [action.params.uploadPath, ...(action.params.options || [])]
    const requestOptions = {
        method: 'PUT',
        url : urlParts.join(';'),
        multipart : [
            { body: fs.createReadStream(action.params.artifactPath) }
        ]
    }

    return makeReuqest(requestOptions, settings);
};

function deleteItem(action, settings){

    const requestOptions = {
        method: 'DELETE',
        url : action.params.pathToItem
    }

    return makeReuqest(requestOptions, settings);
};

function makeReuqest(requestOptions, settings){
    requestOptions.url = `${settings.artifactoryBaseUrl}/artifactory/${requestOptions.url}`;
    requestOptions.auth = {
        user: settings.username,
        pass: settings.password,
        sendImmediately : true
    };
    // return Promise.reject(JSON.stringify(requestOptions));
    return new Promise((resolve,reject)=>{
        request(requestOptions,function (err, response, body) {
            if(err){
                return reject(err);
            }
            if(response.statusCode < 200 || response.statusCode > 300){
                return reject(response.message);
            }
            resolve(response);
        });
    })
}


module.exports = {
    DEPLOY_AN_ARTIFACT: deployArtifact,
    DELETE_FROM_BINTRAY : deleteItem
};
