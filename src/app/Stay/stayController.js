const jwtMiddleware = require("../../../config/jwtMiddleware");
const stayProvider = require("../../app/Stay/stayProvider");
const stayService = require("../../app/Stay/stayService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const {emit} = require("nodemon");

 // + 1 day
 function incr_date(date_str){ 
    var parts = date_str.split("-");
    var dt = new Date(
      parseInt(parts[0], 10),      // year
      parseInt(parts[1], 10) - 1,  // month (starts with 0)
      parseInt(parts[2], 10)       // date
    );
    dt.setDate(dt.getDate() + 1);
    parts[0] = "" + dt.getFullYear();
    parts[1] = "" + (dt.getMonth() + 1);
    if (parts[1].length < 2) {
      parts[1] = "0" + parts[1];
    }
    parts[2] = "" + dt.getDate();
    if (parts[2].length < 2) {
      parts[2] = "0" + parts[2];
    }
    return parts.join("-");
  }

  // - 1 day
  function decr_date(date_str){ 
    var parts = date_str.split("-");
    var dt = new Date(
      parseInt(parts[0], 10),      // year
      parseInt(parts[1], 10) - 1,  // month (starts with 0)
      parseInt(parts[2], 10)       // date
    );
    dt.setDate(dt.getDate() - 1);
    parts[0] = "" + dt.getFullYear();
    parts[1] = "" + (dt.getMonth() + 1);
    if (parts[1].length < 2) {
      parts[1] = "0" + parts[1];
    }
    parts[2] = "" + dt.getDate();
    if (parts[2].length < 2) {
      parts[2] = "0" + parts[2];
    }
    return parts.join("-");
  }

  function pad2(n) {
    return (n < 10 ? '0' : '') + n;
  }

  /**
 * API No. 3
 * API Name : 숙소 검색 API
 * [GET] /search
 * body : address, checkIn, checkOut, guestNum
 */
 exports.searchStay = async function (req, res) {

    var { address, checkIn, checkOut, guestNum, cancelPos, superHost, minPrice, maxPrice, category, bedCount, bedRoomCount, showerCount, petOk, smokingOk} = req.query;

    if (!address) return res.send(errResponse(baseResponse.SEARCH_ADDRESS_EMPTY));

    if(!minPrice) minPrice = 0;
    if(!maxPrice) maxPrice = 9999;
    if(!bedCount) bedCount = 0;
    if(!bedRoomCount) bedRoomCount = 0;
    if(!showerCount) showerCount = 0;
    if (!guestNum) guestNum = 1;

    if (!checkIn && checkOut) checkIn = decr_date(checkOut);
    else if (checkIn && !checkOut) checkOut = incr_date(checkIn);

    var searchResponse;
    const addressForSearch = '%' + address + '%';
    const checkInForSearch = checkIn + '%';
    const checkOutForSearch = checkOut + '%';
    const categoryForSearch = '%' + category + '%';
    const cancelPosFS = '%' + cancelPos + '%';
    const superHostFS= '%' + superHost + '%';
    const petOkFS = '%' + petOk + '%';
    const smokingOkFS = '%' + smokingOk + '%';

    const params = [guestNum, addressForSearch, guestNum, cancelPosFS, superHostFS, minPrice, maxPrice, categoryForSearch, bedCount, bedRoomCount, showerCount, petOkFS, smokingOkFS,
      checkInForSearch, checkInForSearch, checkOutForSearch, checkOutForSearch, checkInForSearch, checkOutForSearch];
    
    const params2 = [addressForSearch, guestNum, cancelPosFS, superHostFS, minPrice, maxPrice, categoryForSearch, bedCount, bedRoomCount, showerCount, petOkFS, smokingOkFS];

    if(!checkIn && !checkOut) searchResponse = await stayProvider.findStayWithoutDate(params2);
    else searchResponse = await stayProvider.findStay(params);

    return res.send(response(baseResponse.SUCCESS, searchResponse));
};

/**
 * API No. 5
 * API Name : 숙소 상세조회 API
 * [GET] /search-stay/:stayId
 * body : address, checkIn, checkOut, guestNum
 */
exports.getStay = async function (req, res) {
  var { stayId, address, checkIn, checkOut, guestNum, cancelPos, superHost, minPrice, maxPrice, category, bedCount, bedRoomCount, showerCount, petOk, smokingOk} = req.query;

  if (!address) return res.send(errResponse(baseResponse.SEARCH_ADDRESS_EMPTY));

  if(!minPrice) minPrice = 0;
  if(!maxPrice) maxPrice = 9999;
  if(!bedCount) bedCount = 0;
  if(!bedRoomCount) bedRoomCount = 0;
  if(!showerCount) showerCount = 0;
  if (!guestNum) guestNum = 1;

  if (!checkIn && checkOut) checkIn = decr_date(checkOut);
  else if (checkIn && !checkOut) checkOut = incr_date(checkIn);

  var searchResponse;
  const addressForSearch = '%' + address + '%';
  const checkInForSearch = checkIn + '%';
  const checkOutForSearch = checkOut + '%';
  const categoryForSearch = '%' + category + '%';
  const cancelPosFS = '%' + cancelPos + '%';
  const superHostFS= '%' + superHost + '%';
  const petOkFS = '%' + petOk + '%';
  const smokingOkFS = '%' + smokingOk + '%';

  const params = [guestNum, addressForSearch, guestNum, cancelPosFS, superHostFS, minPrice, maxPrice, categoryForSearch, bedCount, bedRoomCount, showerCount, petOkFS, smokingOkFS, stayId,
    checkInForSearch, checkInForSearch, checkOutForSearch, checkOutForSearch, checkInForSearch, checkOutForSearch];

  const params2 = [addressForSearch, guestNum, cancelPosFS, superHostFS, minPrice, maxPrice, categoryForSearch, bedCount, bedRoomCount, showerCount, petOkFS, smokingOkFS, stayId];

  if(!checkIn && !checkOut) searchResponse = await stayProvider.findStayDetailWithoutDate(params2);
  else searchResponse = await stayProvider.findStayDetail(params);

  return res.send(response(baseResponse.SUCCESS, searchResponse));
};


/**
 * API No. 6
 * API Name : 숙소등록 API
 * [POST] /hosts/stays
 * 
 */
 exports.postStay = async function (req, res) {

  const userIdFromJWT = req.verifiedToken.userId;
  const { categoryId, stayName, address, maxGuests, stayInfo, price, petOk, smokingOk, bedCount, bedRoomCount, showerCount, stayType, cancelPos, latitude, longitude, imageURL1, imageURL2, imageURL3 } = req.body;

  if(!categoryId || categoryId > 4) return res.send(errResponse(baseResponse.CATEGORYID_EMPTY));
  if(!stayName) return res.send(errResponse(baseResponse.STAYNAME_EMPTY));
  if(!address) return res.send(errResponse(baseResponse.ADDRESS_EMPTY));
  if(!maxGuests) return res.send(errResponse(baseResponse.MAXGUESTS_EMPTY));
  if(!stayInfo) return res.send(errResponse(baseResponse.STAYINFO_EMPTY));
  if(!price) return res.send(errResponse(baseResponse.PRICE_EMPTY));
  if(!petOk) return res.send(errResponse(baseResponse.PETOK_EMPTY));
  if(!smokingOk) return res.send(errResponse(baseResponse.SMOKINGOK_EMPTY));
  if(!bedCount) return res.send(errResponse(baseResponse.BEDCOUNT_EMPTY));
  if(!bedRoomCount) return res.send(errResponse(baseResponse.BEDROOMCOUNT_EMPTY));
  if(!showerCount) return res.send(errResponse(baseResponse.SHOWERCOUNT_EMPTY));
  if(!stayType) return res.send(errResponse(baseResponse.STAYTYPE_EMPTY));
  if(!cancelPos) return res.send(errResponse(baseResponse.CANCELPOS_EMPTY));
  if(!latitude) return res.send(errResponse(baseResponse.LATITUDE_EMPTY));
  if(!longitude) return res.send(errResponse(baseResponse.LONGITUDE_EMPTY));
  if(!imageURL1) return res.send(errResponse(baseResponse.IMAGE_EMPTY));
  if(!imageURL2) return res.send(errResponse(baseResponse.IMAGE_EMPTY));
  if(!imageURL3) return res.send(errResponse(baseResponse.IMAGE_EMPTY));
  

  const params = [userIdFromJWT, categoryId, stayName, address, maxGuests, stayInfo, price, petOk, smokingOk, bedCount, bedRoomCount, showerCount, stayType, cancelPos, latitude, longitude];
  const paramsImage = [imageURL1, imageURL2, imageURL3];

  
  const postBasketResponse = await stayService.postStay(params, paramsImage);

  return res.send(postBasketResponse);
};

/**
 * API No. 7
 * API Name : 숙소삭제 API
 * [PATCH] /hosts/stays/:stayId
 * 
 */
exports.patchStayStatus = async function (req, res) {

  const userIdFromJWT = req.verifiedToken.userId;
  const stayId = req.params.stayId;

  const patchStay = await stayService.editStayStatus(stayId, userIdFromJWT);

  return res.send(patchStay);
};

/**
 * API No. 8
 * API Name : 숙소수정 API
 * [PATCH] /hosts/stays/:stayId
 * 
 */
 exports.patchStayType = async function (req, res) {

  const userIdFromJWT = req.verifiedToken.userId;
  const stayId = req.params.stayId;
  const { stayType } = req.body;

  const patchStayResponse = await stayService.editStayType(stayType, stayId, userIdFromJWT);

  return res.send(patchStayResponse);
};

/**
 * API No. 9
 * API Name : 위시리스트 생성 API
 * [POST] /wish-lists
 * path : wishId
 */
 exports.postWish = async function (req, res) {

  const userIdFromJWT = req.verifiedToken.userId;
  const { name } = req.body;

  const postBasketResponse = await stayService.postWishBasket(userIdFromJWT, name);

  return res.send(postBasketResponse);
};

/**
 * API No. 10
 * API Name : 위시리스트에 숙소 추가 API
 * [POST] /stays/:stayId/wish-list/:wishId
 * path : stayId, basket
 */
 exports.postStayInWish = async function (req, res) {

  const stayId = req.params.stayId;
  const basketId = req.params.basketId;

  const postingBasketResponse = await stayService.postWishStay(stayId, basketId);

  return res.send(postingBasketResponse);
};

/**
 * API No. 11
 * API Name : 위시리스트 숙소 삭제 API
 * [PATCH] /wish-lists/:wishId/stay
 * path : wishId
 */
 exports.patchStayInWish = async function (req, res) {

  const wishId = req.params.wishId;
  const patchingBasketResponse = await stayService.patchWishStay(wishId);

  return res.send(patchingBasketResponse);
};

/**
 * API No. 12
 * API Name : 위시리스트 삭제 API
 * [PATCH] /wish-lists/:basketId
 * path : basketId
 */
 exports.patchWish = async function (req, res) {

  const basketId = req.params.basketId;
  const patchingBasketResponse = await stayService.patchWishBasket(basketId);
  return res.send(patchingBasketResponse);
};

/**
 * API No. 32
 * API Name : 게스트 예약 취소 API
 * [PATCH] booking/:bookId/status
 * path : bookId
 * body : checkIn
 */
 exports.patchGuestBookStatus = async function (req, res) {

  const userIdFromJWT = req.verifiedToken.userId;
  const bookId = req.params.bookId;
  const { checkIn } = req.body
  
  var date = new Date();
  var month = pad2(date.getMonth()+1);//months (0-11)
  var day = pad2(date.getDate());//day (1-31)
  var year= date.getFullYear();

  var today =  year+"-"+month+"-"+day;
  if(today.getTime === checkIn.getTime) return res.send(errResponse(baseResponse.CANCEL_BOOKING_IMP));

  const patchingBookedResponse = await stayService.patchGuestBookStatus(bookId, userIdFromJWT);
  return res.send(patchingBookedResponse);
};

/**
 * API No. 33
 * API Name : 호스트 예약 취소 API
 * [PATCH] /hosts/booking/:bookId/status
 * path : bookId
 */
 exports.patchBookedStatus = async function (req, res) {
  const userIdFromJWT = req.verifiedToken.userId;
  const bookId = req.params.bookId;

  const patchingBookedResponse = await stayService.patchBookedStatus(bookId);
  return res.send(patchingBookedResponse);
};

/**
 * API No. 34
 * API Name : 호스트 코멘트 수정 API
 * [PATCH] /hostcommet/:stayId
 * path : stayId
 */
 exports.patchHostCmmt = async function (req, res) {

  const userIdFromJWT = req.verifiedToken.userId;
  const stayId = req.params.stayId;
  const { hostComment } = req.body;
  console.log(hostComment);

  const cmmtResponse = await stayService.patchHostCmmt(hostComment, stayId, userIdFromJWT);
  return res.send(cmmtResponse);
};