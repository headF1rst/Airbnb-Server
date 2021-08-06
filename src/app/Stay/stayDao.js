// 숙소 조회 (체크인, 아웃 날짜 입력 없는경우)
async function selectStayWithoutDate(connection, address, guestNum) 
{
    const query = `
    select Stay.stayId, superHost, stayName, address, imageURL, maxGuests, bedRoomCount, bedCount, showerRoomCount, avgRate, cntRate
       from Stay left join(select round(avg((accurateRate+cleanRate+communicateRate+rocationRate+satisfiedRate+checkInRate)/6), 1) as 'avgRate',
                                  count(*) as cntRate, stayId
                                  from Review
                                  group by stayId having count(*)>=1) as R on Stay.stayId = R.stayId
       left join (select superHost, userId
                    from User) as U on U.userId = Stay.userId
       left join (select stayId, imageURL
                    from StayImage) as SI on SI.stayId = Stay.stayId
       where Stay.status = 'Active' and address  LIKE ? and maxGuests >= ?;
          `;
    const [selectRoomsRows] = await connection.query(query, [address, guestNum]);
    return selectRoomsRows;
}

// 숙소 조회 
async function selectStay(connection, params) 
{
    const query = `
    select Stay.stayId, superHost, stayName, address, imageURL, maxGuests, bedRoomCount, bedCount, showerRoomCount, avgRate, cntRate, price
       from Stay left join(select round(avg((accurateRate+cleanRate+communicateRate+rocationRate+satisfiedRate+checkInRate)/6), 1) as 'avgRate',
                                  count(*) as cntRate, stayId
                                  from Review
                                  group by stayId having count(*)>=1) as R on Stay.stayId = R.stayId
       left join (select superHost, userId
                    from User) as U on U.userId = Stay.userId
       left join (select stayId, imageURL
                    from StayImage) as SI on SI.stayId = Stay.stayId
       where Stay.status = 'Active' and address  LIKE ? and maxGuests >= ? and Stay.stayId not in(
            select BS.stayId
            from Booking BK join BookedStay BS
                on BK.bookId = BS.bookId
            where (checkIn <= ? and checkOut >= ?) or (checkIn < ? and checkOut >= ?) or (? <= checkIn and ? >= checkIn)
           );
          `;
    const [selectRoomsRows] = await connection.query(query, params);
    return selectRoomsRows;
}

module.exports = {
    selectStayWithoutDate,
    selectStay,
}
