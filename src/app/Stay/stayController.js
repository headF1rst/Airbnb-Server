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

    var { address, checkIn, checkOut, guestNum } = req.query;

    if (!address) return res.send(errResponse(baseResponse.SEARCH_ADDRESS_EMPTY));

    if (!checkIn && checkOut) checkIn = decr_date(checkOut);
    else if (checkIn && !checkOut) checkOut = incr_date(checkIn);
    
    if (!guestNum) guestNum = 0;

    var searchResponse;
    const addressForSearch = '%' + address + '%';
    const checkInForSearch = checkIn + '%';
    const checkOutForSearch = checkOut + '%';
    
    const params = [guestNum, addressForSearch, guestNum, checkInForSearch, checkInForSearch, checkOutForSearch, checkOutForSearch, checkInForSearch, checkOutForSearch];

    if(!checkIn && !checkOut) searchResponse = await stayProvider.findStayWithoutDate(addressForSearch, guestNum);
    else searchResponse = await stayProvider.findStay(params);

    return res.send(response(baseResponse.SUCCESS, searchResponse));
};

/**
 * API No. 5
 * API Name : 숙소 가격대별 검색 API
 * [GET] /search/prices
 * path variable : userId
 * body : nickname
 */
 exports.searchStayByPrice = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId;

    const userId = req.params.userId;
    const nickname = req.body.nickname;

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

        const editUserInfo = await userService.editUser(userId, nickname)
        return res.send(editUserInfo);
    }
};

