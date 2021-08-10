const jwtMiddleware = require("../../../config/jwtMiddleware");
const stayProvider = require("../../app/Stay/stayProvider");
const stayService = require("../../app/Stay/stayService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const {emit} = require("nodemon");

/**
 * API No. 3
 * API Name : 숙소 검색 API
 * [GET] /search
 * body : address, checkIn, checkOut, guestNum
 */

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

