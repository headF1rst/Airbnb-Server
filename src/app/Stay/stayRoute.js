module.exports = function(app){
    const stay = require('./stayController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 3. 숙소 검색 API
    app.get('/search', stay.searchStay);

    // 5. 숙소 가격대별 검색 API
    app.get('/search/prices', stay.searchStayByPrice);

};