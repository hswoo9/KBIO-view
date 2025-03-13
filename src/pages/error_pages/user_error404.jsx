function user_error404(props) {

  return (
      <>
        <div id="wrap" className="user">
          <div id="container" className="error">
            <div className="inner">
              <div className="inner2" data-aos="fade-in">
                <figure className="imgBox"><img src="/css/images/error404.png" alt="image"/></figure>
                <div className="textBox">
                  <strong className="title"><span className="blue">404</span> ERROR</strong>
                  <p className="text">죄송합니다. 페이지를 찾을 수 없습니다. <br/>존재하지 않는 주소를 입력하셨거나 <br/>요청하신 페이지의 주소가 변경, 삭제되어 찾을 수
                    없습니다.</p>
                </div>
                <button type="button" className="clickBtn"><span>뒤로가기</span></button>
              </div>
            </div>
          </div>
        </div>
      </>
  );
}

export default user_error404;
