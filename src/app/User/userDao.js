// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT email, nickname 
                FROM UserInfo;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
                SELECT email, name 
                FROM User
                WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

// userId 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
                 SELECT userId, email, name 
                 FROM User
                 WHERE userId = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO User(name, birth, email, password)
        VALUES (?, ?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT email, password
        FROM User
        WHERE email = ?;`;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );

  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, email) {
  const selectUserAccountQuery = `
        SELECT name, userId, status
        FROM User
        WHERE email = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      email
  );
  return selectUserAccountRow[0];
}

async function updateUserInfo(connection, name, userIdFromJWT) {
  const updateUserQuery = `
  UPDATE User
  SET name = ?
  WHERE userId = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [name, userIdFromJWT]);
  return updateUserRow[0];
}

async function updateUserSex(connection, sex, userIdFromJWT) {
  const updateUserQuery = `
  UPDATE User
  SET sex = ?
  WHERE userId = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [sex, userIdFromJWT]);
  return updateUserRow[0];
}

async function updateUserBirth(connection, birth, userIdFromJWT) {
  const updateUserQuery = `
  UPDATE User
  SET birth = ?
  WHERE userId = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [birth, userIdFromJWT]);
  return updateUserRow[0];
}

async function updateUserEmail(connection, email, userIdFromJWT) {
  const updateUserQuery = `
  UPDATE User
  SET email = ?
  WHERE userId = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [email, userIdFromJWT]);
  return updateUserRow[0];
}

async function updateUserPhone(connection, phone, userIdFromJWT, phoneId) {
  const updateUserQuery = `
  UPDATE PhoneNumber
  SET phoneNum = ?
  WHERE userId = ? and phoneId = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [phone, userIdFromJWT, phoneId]);
  return updateUserRow[0];
}

async function updateUserStatus(connection, userIdFromJWT) {
  const updateUserQuery = `
  UPDATE User
  SET status = 'Deleted'
  WHERE userId = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, userIdFromJWT);
  return updateUserRow[0];
}

async function jwtUserCheck(connection, userId) {
  const updateUserQuery = `
  select name, userId
  from User
  where userId = ?;
  `;
  const UserRow = await connection.query(updateUserQuery, userId);
  return UserRow[0];
}


module.exports = {
  selectUser,
  selectUserEmail,
  selectUserId,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  updateUserInfo,
  updateUserSex,
  updateUserBirth,
  updateUserEmail,
  updateUserPhone,
  updateUserStatus,
  jwtUserCheck,
};
