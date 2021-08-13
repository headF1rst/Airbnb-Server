module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    //Request error
    SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2001, "message":"이메일을 입력해주세요" },
    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2002, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2003, "message":"이메일 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2004, "message": "비밀번호를 입력 해주세요." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2005, "message":"비밀번호는 8~20자리를 입력해주세요." },
    SIGNUP_NICKNAME_EMPTY : { "isSuccess": false, "code": 2006, "message":"닉네임을 입력 해주세요." },
    SIGNUP_NICKNAME_LENGTH : { "isSuccess": false,"code": 2007,"message":"닉네임은 최대 20자리를 입력해주세요." },

    SIGNIN_EMAIL_EMPTY : { "isSuccess": false, "code": 2008, "message":"이메일을 입력해주세요" },
    SIGNIN_EMAIL_LENGTH : { "isSuccess": false, "code": 2009, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNIN_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2010, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2011, "message": "비밀번호를 입력 해주세요." },

    USER_USERID_EMPTY : { "isSuccess": false, "code": 2012, "message": "userId를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2013, "message": "해당 회원이 존재하지 않습니다." },

    USER_USEREMAIL_EMPTY : { "isSuccess": false, "code": 2014, "message": "이메일을 입력해주세요." },
    USER_USEREMAIL_NOT_EXIST : { "isSuccess": false, "code": 2015, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "유저 아이디 값을 확인해주세요" },
    USER_NAME_EMPTY : { "isSuccess": false, "code": 2017, "message": "변경할 이름을 입력해주세요" },

    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2018, "message": "회원 상태값을 입력해주세요" },
    INVALID_AGE : { "isSuccess": false, "code": 2019, "message": "만 18세 이상의 성인만 회원으로 가입할 수 있습니다." },
    DOB_FORMAT_ERR : { "isSuccess": false, "code": 2020, "message": "yyyy/mm/dd 형식으로 입력해주세요." },
    SIGNUP_PASSWORD_NUMORCHAR : { "isSuccess": false, "code": 2021, "message": "숫자나 기호를 비밀번호에 포함해야 합니다." },
    SIGNUP_NAME_EMPTY : { "isSuccess": false, "code": 2022, "message": "이름을 입력해주세요." },
    SIGNUP_BIRTH_EMPTY : { "isSuccess": false, "code": 2023, "message": "생년월일을 입력해주세요." },
    SINUP_PASSWORD_HAS_USERNAME : { "isSuccess": false, "code": 2024, "message": "비밀번호에 이름 또는 이메일이 포함되서는 안됩니다." },
    SEARCH_ADDRESS_EMPTY : { "isSuccess": false, "code": 2025, "message": "어디로 여행가세요?" },
    USER_SEX_EMPTY : { "isSuccess": false, "code": 2026, "message": "성별을 지정해 주세요. (남자,여자,기타)"},
    INVALID_AGE_EDIT : { "isSuccess": false, "code": 2027, "message": "에어비앤비를 이용하려면 만 18세 이상이어야 합니다. 올바른 생년월일을 다시 입력해주세요."},
    PHONE_NUMBER_EMPTY : { "isSuccess": false, "code": 2028, "message": "전화번호를 입력해 주세요"},
    INVALID_PHONENUM : { "isSuccess": false, "code": 2029, "message": "올바른 형식의 전화번호를 입력해 주세요."},
    CANCEL_BOOKING_IMP : { "isSuccess": false, "code": 2030, "message": "당일 예약 취소는 불가능 합니다."},
    CLEANRATE_EMPTY : { "isSuccess": false, "code": 2031, "message": "청결 점수를 입력해 주세요. (0~5)"},
    COMMUNICATERATE_EMPTY : { "isSuccess": false, "code": 2032, "message": "소통 점수를 입력해 주세요. (0~5)"},
    CHECKINRATE_EMPTY : { "isSuccess": false, "code": 2033, "message": "체크인 점수를 입력해 주세요. (0~5)"},
    ACCURATERATE_EMPTY : { "isSuccess": false, "code": 2034, "message": "정확도 점수를 입력해 주세요. (0~5)"},
    ROCATIONRATE_EMPTY : { "isSuccess": false, "code": 2035, "message": "위치 점수를 입력해 주세요. (0~5)"},
    SATISFIEDRATE_EMPTY : { "isSuccess": false, "code": 2036, "message": "만족도 점수를 입력해 주세요. (0~5)"},
    CATEGORYID_EMPTY : { "isSuccess": false, "code": 2037, "message": "카테고리 유형 아이디를 입력해주세요 (1~4)."},
    STAYNAME_EMPTY : { "isSuccess": false, "code": 2038, "message": "숙소 이름을 입력해주세요."},
    ADDRESS_EMPTY : { "isSuccess": false, "code": 2039, "message": "숙소 주소를 입력해주세요."},
    MAXGUESTS_EMPTY : { "isSuccess": false, "code": 2040, "message": "최대 숙박 가능인원을 입력해주세요"},
    STAYINFO_EMPTY : { "isSuccess": false, "code": 2041, "message": "숙소 정보를 입력해주세요."},
    PRICE_EMPTY : { "isSuccess": false, "code": 2042, "message": "1박 가격을 입력해주세요"},
    PETOK_EMPTY : { "isSuccess": false, "code": 2043, "message": "반려동물 반입 가능 여부를 입력해주세요. (Y:가능, N:불가)"},
    SMOKINGOK_EMPTY : { "isSuccess": false, "code": 2044, "message": "흡연 가능 여부를 입력해주세요 (Y:가능, N:불가)"},
    BEDCOUNT_EMPTY : { "isSuccess": false, "code": 2045, "message": "침대 개수를 입력해주세요"},
    BEDROOMCOUNT_EMPTY : { "isSuccess": false, "code": 2046, "message": "침실 개수를 입력해주세요"},
    SHOWERCOUNT_EMPTY : { "isSuccess": false, "code": 2047, "message": "욕실 개수를 입력해주세요."},
    STAYTYPE_EMPTY : { "isSuccess": false, "code": 2048, "message": "숙소 타입을 선택해주세요"},
    CANCELPOS_EMPTY : { "isSuccess": false, "code": 2049, "message": "예약취소 가능여부를 선택해주세요. (Y:가능, N:불가)"},
    LATITUDE_EMPTY : { "isSuccess": false, "code": 2050, "message": "위도값을 입력해주세요"},
    LONGITUDE_EMPTY : { "isSuccess": false, "code": 2051, "message": "경도값을 입력해주세요"},
    IMAGE_EMPTY : { "isSuccess": false, "code": 2052, "message": "기본 이미지 3장을 포함해야합니다."},
    USER_ACCESS_TOKEN_WRONG : { "isSuccess": false, "code": 2053, "message": "엑세스 토큰값을 다시 입력해주세요."},
    USER_INFO_EMPTY : { "isSuccess": false, "code": 2054, "message": "유저 정보가 비어있습니다."},
    INACTIVE_ROOM : { "isSuccess": false, "code": 2055, "message": "숙소가 존재하지 않습니다."},
    USER_DELETED : { "isSuccess": false, "code": 2056, "message": "이미 탈퇴한 회원정보 입니다."},
    CHECKIN_EMPTY : { "isSuccess": false, "code": 2057, "message": "숙소 체크인 날짜를 입력해주세요."},
    CHECKOUT_EMPTY : { "isSuccess": false, "code": 2058, "message": "숙소 체크아웃 날짜를 입력해주세요."},



    // Response error
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"중복된 닉네임입니다." },

    SIGNIN_EMAIL_WRONG : { "isSuccess": false, "code": 3003, "message": "아이디가 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },
    NO_BOOKPOS_DATE : { "isSuccess": false, "code": 3007, "message": "예약 가능한 날짜가 없습니다." },


    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
 
 
}
