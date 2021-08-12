### 2021-07-31 진행상황
---
- 에어비엔비 기획서 제출 (완료)
- Ec2 서버 구축 (완료)
- 서브 도메인 (dev/prod) ssl 적용 (완료)
- ERD 설계 1차 (완료)

**서브 도메인 (dev/prod) ssl 적용 (완료)**

Lets encrypt를 사용하여 서브도메인인 dev.devsanha.site, prod.devsanha.site에 ssl 인증 적용을 해주었습니다.

`# certbot --nginx -d 추가할 도메인 -d 추가할 도메인

**ERD 설계 1차**

에어비엔비 웹사이트를 바탕으로 데이터들의 관계를 파악하여 1차 erd를 설계해 보았습니다. (피드백 후 수정예정)

`status`의 데이터 타입을 *tinyint* 와 *varchar* 사이에 고민을 하였습니다.
varchar의 경우 상태 정보가 보다 명시적이어서 클라이언트가 파악하기 쉽다는 장점이 있고, tinyint는 데이터의 크기가 varchar보다 적게 사용된다는 장점이 있었습니다.

처음 클라이언트와 협업해 보는 것이고 많은 데이터가 사용될거 같지는 않아서 `varchar` 타입을 선택하게 되었습니다.
<br>

### 2021-08-02 진행상황
---
- 로그인 API 설계 (완료)
- 회원가입 API 설계 (완료)
- 로그인, 회원가입 API 명세서 작성 (완료)

**로그인 API 설계** 

기존 jwt값만을 result로 반환한 것을 클라이언트의 요청에 따라 return값에 name과 email값을 추가하였습니다.

**회원가입 API 설계**

이메일 형식, 비밀번호 8~20자리, 비밀번호 숫자 혹은 기호 포함, 비밀번호에 이름 또는 이메일이 포함 불가, yyyy/mm/dd 형식으로 생년월일 입력, 만 18세 이상만 가입가능

등의 validation 처리를 작성하였습니다.

### 2021-08-04 진행상황
---
- 서브도메인 (dev, prod) 리버스 프록시 적용 (완료)
- ERD 수정 2차 (완료)

**ERD 2차 수정**

회원 한명당 여러개의 전화번호를 저장할 수 있다는 것을 알아내어 `PhoneNumber` 테이블을 추가후 `User` 테이블과 연결해 주었습니다.

### 2021-08-06 진행상황
---
- 숙소 검색 API 설계 (완료)
- jwt 검증 API 설계 (완료)

**숙소 검색 API 설계**

에어비엔비의 주요 기능중 하나라고 생각하여 정확한 기능을 파악하고 가능한 똑같이 구현하기 위해 노력하였습니다.

숙소를 조회할때 가장 먼저 사용자가 접하는 창은 다음과 같습니다.

![검색 창](/image/searchAPI.png)

실제 에어비엔비의 검색 창에서 여러 값들을 넣어서 테스트 해본 결과, 위치값은 반드시 필요했으나 체크인, 체크아웃, 게스트인원을 입력 안했을 시에는 

예약 날짜와 숙박 인원수에 구속 받지 않는 모든 숙소를 검색하는 것을 알 수 있었습니다. 

또한 체크인 값만을 입력했을 시에는 체크아웃 날짜가 자동으로 그 다음 날짜로 설정되었고

반대로 체크아웃 값만 입력한 경우에는 체크인 날짜가 자동으로 그 전 날짜로 설정되는 것을 파악하여 그러한 기능의 함수를 소스코드에 추가해 주었습니다.

---

![검색결과](/image/searchResult.png)

처음에는 숙소 검색 API를 "취소가능 숙소 검색 API", "유형별 숙소검색 API", "가격대별 숙소 검색 API" 등 필터 조건별로 API를 구현해야 하나 생각하였지만 

취소가 가능하면서 가격대가 $50 ~ $180 인 조건이 중복되어 들어갈 수 있다는 점을 고려하여 하나의 "숙소 검색 API"로 묶어서 구현하였습니다. 

때문에 URI 쿼리의 길이가 상당히 길어지게 되었지만 실제 에어비엔비 숙소검색 창의 URI도 상당히 긴것을 보아 알맞게 구현하였다 생각했습니다.

### 2021-08-06 진행상황
---
- 숙소 등록, 삭제, 수정 API 설계 (완료)
- 위시리스트 생성, 삭제 API 설계 (완료)
- 위시리스트에 숙소 추가, 삭제 API 설계 (완료)

**숙소 등록 API 설계**

호스트의 경우 숙소 등록, 삭제, 수정등의 서비스를 사용할 수 있습니다. 

숙소 등록시에는 3장 이상의 숙소에 대한 사진을 같이 등록해야 하기 때문에 트랜잭션 처리를 해야했습니다.

`Stay` 테이블에 숙소 정보를 생성해줌과 동시에 생성된 stayId (insertId)값을 사용하여 `StayImage` 테이블에 3장의 이미지를 등록해 주었습니다.

``` javascript
try 
{
    connection.beginTransaction(); // 트랜잭션 적용 시작
    const postRoomResult = await stayDao.postRoom(connection, params);
            
    for(var i=0; i<3; i++)
    {
        var postImageURL = await stayDao.postImageURL(connection, postRoomResult.insertId, paramsImage[i]);
    }
    await connection.commit(); // 커밋
    connection.release(); // conn 회수
    connection.release();
            
    return response(baseResponse.SUCCESS);
}
```

**숙소 삭제 API 설계**

호스트가 숙소를 삭제하는 경우, 만약 해당 숙소에 예약이 잡혀있던 상태였다면 예약취소 또한 같이 해줘야 된다고 생각하여 트랜잭션 처리를 해주었습니다.

`Stay` 테이블과 `Booking` 테이블을 동시에 수정해 주었습니다.

``` javascript
try 
{
    connection.beginTransaction(); // 트랜잭션 적용 시작
    const stayResult = await stayDao.patchStayStatus(connection, stayId, userIdFromJWT);
    const b = await stayDao.editBookingStatusTS(connection, stayId);
    await connection.commit(); // 커밋
    connection.release(); // conn 회수
    connection.release();
            
    return response(baseResponse.SUCCESS);
}
```

**위시리스트에서 숙소삭제 API**

에어비엔비에서 테스트 결과 위시리스트에서 숙소를 전부 삭제하여도 위시리스트는 삭제되지 않았습니다.

### 2021-08-08 진행상황
---
- 회원정보 수정 API 설계 (완료)
- 회원 전화번호 삭제 API 설계 (완료)
- 호스트 코멘트 수정 API 설계 (완료)
- 리뷰 등록 API 설계 (완료)

**회원정보 수정 API 설계**

에어비엔비의 개인정보 수정 화면을 들어가서 확인해본 결과 다음과 같았습니다.

![회원정보수정](/image/userInfo.png)

각각의 정보들을 따로 수정 가능하기 때문에 "회원 이름수정 API", "회원 이메일수정 API" 등과 같이 회원정보 수정 API를 세분화 시켜 주었습니다.

한가지 특이한 점은 실제 에어비엔비에서 회원이름 수정시에 글자수 제한, 특수문자 사용 불가 형식처리가 되어있지 않다는 점을 발견할 수 있었습니다.

또한 생년월일을 만 18세 이하로 수정할 시에 수정 불가하도록 validation 처리를 해주었습니다.

### 2021-08-10 진행상황
- 회원탈퇴 API 설계 (완료)
- 숙소 상세조회 API 설계 (완료)
- 게스트 예약취소 API 설계 (완료)
- 호스트 예약취소 API 설계 (완료)
- dev 서버 다운으로 인한 복구 (완료)

**숙소 상세조회 API 설계**

특정 숙소에 대한 정보를 가져오는 숙소 상세조회 API를 설계하였습니다. 숙박 기간에 따라 가격이 달라지도록 쿼리문을 작성하였고

평균 평점과 리뷰 개수를 반환하도록 하였습니다.

**게스트 예약취소 API 설계**

게스트가 예약을 취소할 시에, currentDate을 받아와서 당일 예약취소는 불가하게 validation 처리를 추가 해 주었습니다.

### 2021-08-12 진행상황
---
- 카카오 소셜 로그인 API 설계 (완료)
- prod 스키마 초기화
- 최종 api 점검

