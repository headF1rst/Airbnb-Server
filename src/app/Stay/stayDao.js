// 숙소 조회 (체크인, 아웃 날짜 입력 없는경우)
async function selectStayWithoutDate(connection, params2) 
{
    const query = `
    select Stay.stayId, superHost, stayName, address, imageURL, maxGuests, bedRoomCount, bedCount, showerRoomCount, cancelPos, stayType, avgRate, cntRate, latitude, longitude
       from Stay left join(select round(avg((accurateRate+cleanRate+communicateRate+rocationRate+satisfiedRate+checkInRate)/6), 1) as 'avgRate',
                                  count(*) as cntRate, stayId
                                  from Review
                                  group by stayId having count(*)>=1) as R on Stay.stayId = R.stayId
       left join (select superHost, userId
                    from User) as U on U.userId = Stay.userId
       left join (select stayId, imageURL
                    from StayImage) as SI on SI.stayId = Stay.stayId
       where Stay.status = 'Active' and address  LIKE ? and maxGuests >= ? and cancelPos like ? and superHost like ? and (price between ? and ?) and stayType like ?
         and  bedCount >= ? and bedRoomCount >= ? and showerRoomCount >= ? and petOk like ? and smokingOk like ?;
          `;
    const [selectRoomsRows] = await connection.query(query, params2);
    return selectRoomsRows;
}

// 숙소 조회 
async function selectStay(connection, params) 
{   
    console.log(params);
    const query = `
    select Stay.stayId, superHost, stayName, address, imageURL, maxGuests, bedRoomCount, bedCount, showerRoomCount, cancelPos, stayType,
       avgRate, cntRate, concat('$', price * ?) as totalPrice, latitude, longitude
       from Stay left join(select round(avg((accurateRate+cleanRate+communicateRate+rocationRate+satisfiedRate+checkInRate)/6), 1) as 'avgRate',
                                  count(*) as cntRate, stayId
                                  from Review
                                  group by stayId having count(*)>=1) as R on Stay.stayId = R.stayId
       left join (select superHost, userId
                    from User) as U on U.userId = Stay.userId
       left join (select stayId, imageURL
                    from StayImage) as SI on SI.stayId = Stay.stayId
       where Stay.status = 'Active' and address  LIKE ? and maxGuests >= ? and cancelPos like ? and superHost like ? and (price between ? and ?) and stayType like ?
         and  bedCount >= ? and bedRoomCount >= ? and showerRoomCount >= ? and petOk like ? and smokingOk like ?
         and Stay.stayId not in(
            select BS.stayId
            from Booking BK join BookedStay BS
                on BK.bookId = BS.bookId
            where (checkIn <= ? and checkOut >= ?) or (checkIn < ? and checkOut >= ?) or (? <= checkIn and ? >= checkIn)
           );
          `;
    const [selectRoomsRows] = await connection.query(query, params);
    return selectRoomsRows;
}

// 숙소 등록 
async function postRoom(connection, params) 
{
    const query = `
    INSERT INTO Stay(userId, categoryId, stayName, address, maxGuests, stayInfo, price, petOk, smokingOk, bedCount, bedRoomCount, showerRoomCount, stayType, cancelPos, latitude, longitude)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
          `;
    const [selectRoomsRows] = await connection.query(query, params);
    return selectRoomsRows;
}

// 숙소 삭제
async function patchStayStatus(connection, stayId, userIdFromJWT) 
{
    const query = `
    UPDATE Stay
    SET status = 'Deleted'
    WHERE stayId = ? and userId = ?;
          `;
    const [selectRoomsRows] = await connection.query(query, [stayId, userIdFromJWT]);
    return selectRoomsRows;
}

// 숙소 유형 수정
async function patchStayType(connection, stayType, stayId, userIdFromJWT) 
{
    const query = `
    UPDATE Stay
    SET stayType = ?
    WHERE stayId = ? and userId = ?;
          `;
    const [selectRoomsRows] = await connection.query(query, [stayType, stayId, userIdFromJWT]);
    return selectRoomsRows;
}

// 위시리스트 추가
async function postBasket(connection, userIdFromJWT, name) 
{
    const query = `
    INSERT INTO WishBasket(userId, basketName)
    VALUES (?, ?);
          `;
    const [selectRoomsRows] = await connection.query(query, [userIdFromJWT, name]);
    return selectRoomsRows;
}

// 위시리스트 숙소 추가
async function postWishRoom(connection, stayId, basketId) 
{
    const query = `
    INSERT INTO WishList(stayId, basketId)
    VALUES (?, ?);
          `;
    const [selectRoomsRows] = await connection.query(query, [stayId, basketId]);
    return selectRoomsRows;
}

// 위시리스트 숙소 삭제
async function patchWishRoom(connection, wishId) 
{
    const query = `
    UPDATE WishList
    SET status = 'Deleted'
    WHERE wishId = ?;
          `;
    const [selectRoomsRows] = await connection.query(query, wishId);
    return selectRoomsRows;
}

async function patchAllWishRoom(connection, basketId) 
{
    const query = `
    UPDATE WishList
    SET status = 'Deleted'
    WHERE basketId = ?;
          `;
    const [selectRoomsRows] = await connection.query(query, basketId);
    return selectRoomsRows;
}

// 위시리스트 삭제
async function patchBasket(connection, basketId) 
{
    const query = `
    UPDATE WishBasket
    SET status = 'Deleted'
    WHERE basketId = ?;
          `;
    const [selectRoomsRows] = await connection.query(query, basketId);
    return selectRoomsRows;
}

// 숙소 삭제 트랜잭션 삭제
async function editBookingStatusTS(connection, stayId) 
{
    const query = `
    UPDATE Booking
    SET status = 'Deleted'
    WHERE stayId = ?;
          `;
    const [selectRoomsRows] = await connection.query(query, stayId);
    return selectRoomsRows;
}

// 게스트 예약 취소
async function editGuestBookingStatus(connection, bookId, userIdFromJWT) 
{
    const query = `
    UPDATE Booking
    SET status = 'Deleted'
    WHERE bookId = ? and userId = ?;
          `;
    const [selectRoomsRows] = await connection.query(query, [bookId, userIdFromJWT]);
    return selectRoomsRows;
}

// 호스트 예약 취소
async function editBookingStatus(connection, bookId) 
{
    const query = `
    UPDATE Booking
    SET status = 'Deleted'
    WHERE bookId = ?;
          `;
    const [selectRoomsRows] = await connection.query(query, bookId);
    return selectRoomsRows;
}

// 호스트 코멘트 수정
async function editHostCmmt(connection, cmmt, stayId, userIdFromJWT) 
{
    const query = `
    UPDATE Stay
    SET hostComment = ?
    WHERE stayId = ? and userId = ?;
          `;
    const [selectRoomsRows] = await connection.query(query, [cmmt, stayId, userIdFromJWT]);
    return selectRoomsRows;
}

module.exports = {
    selectStayWithoutDate,
    selectStay,
    postRoom,
    postBasket,
    postWishRoom,
    patchWishRoom,
    patchAllWishRoom,
    patchBasket,
    patchStayType,
    editBookingStatusTS,
    editBookingStatus,
    editGuestBookingStatus,
    editHostCmmt,
    patchStayStatus,
}
