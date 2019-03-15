const Endpoints = require('../Common/Endpoints');
const axios = require('axios');

module.exports = class BraspagAuthClient {
    constructor(options) {
        if (options.env == 'production')
            this.url = Endpoints.BraspagAuthProduction;
        else
            this.url = Endpoints.BraspagAuthSandbox;
    }

    async createAccessToken(request) {
        if (typeof request === 'undefined' || request === null)
            throw new Error("Request is null");

        if (typeof request.clientId === 'undefined' || request.clientId === null)
            throw new Error("Invalid credentials: ClientId is null");

        if (typeof request.clientSecret === 'undefined' || request.clientSecret === null)
            throw new Error("Invalid credentials: ClientSecret is null");

        let headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'cache-control': 'no-cache'
        };

        let auth = {
            username: request.clientId,
            password: request.clientSecret
        };

        var response;

        await axios.post(`${this.url}oauth2/token`, 'grant_type=client_credentials', {headers, auth})
            .then(res => {
                response = res.data;
                response.httpStatus = res.status;
            })
            .catch(error => {
                response = error.response.data;
                response.httpStatus = error.response.status;
            })

        return response;
    };
}