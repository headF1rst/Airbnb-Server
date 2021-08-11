module.exports = function(app){
    const stay = require('./stayController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 3. 숙소 검색 API
    app.get('/search', stay.searchStay);

    // 6. 숙소등록 API
    app.post('/hosts/stays', jwtMiddleware, stay.postStay);

    // 7. 숙소삭제 API
    app.patch('/hosts/stays/:stayId/status', jwtMiddleware, stay.patchStayStatus);

    // 8. 숙소 유형 수정 API
    app.patch('/hosts/stay-type/:stayId', jwtMiddleware, stay.patchStayType);

    // 9. 위시리스트 생성 API
   app.post('/wish-lists', jwtMiddleware, stay.postWish);

   // 10. 위시리스트 숙소 추가 API
   app.post('/stays/:stayId/wish-list/:basketId', stay.postStayInWish);

   // 11. 위시리스트 숙소 삭제 API
   app.patch('/wish-lists/:wishId/stay', stay.patchStayInWish);

   // 12. 위시리스트 삭제 API
   app.patch('/wish-lists/:basketId', jwtMiddleware, stay.patchWish);

   // 32. 게스트 예약 취소 API
   app.patch('/booking/:bookId/status', jwtMiddleware, stay.patchGuestBookStatus);

   // 33. 호스트 예약 취소 API
   app.patch('/hosts/booking/:bookId/status', jwtMiddleware, stay.patchBookedStatus);

    // 34. 호스트 코멘트 수정 API
   app.patch('/hostcommet/:stayId', jwtMiddleware, stay.patchHostCmmt);
};