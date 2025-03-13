function user_error500(props) {

  return (
      <>
        <div id="wrap" className="user">
          <div id="container" className="error">
            <div className="inner">
              <div className="inner2" data-aos="fade-in">
                <figure className="imgBox"><img src="/css/images/error500.png" alt="image"/></figure>
                <div className="textBox">
                  <strong className="title">페이지가 작동하지 않습니다.</strong>
                  <p className="text">
                    현재 <strong>kbiolabhub.com</strong>에서 요청을 처리할 수 없습니다. <br/>
                    <span className="gray">HTTP ERROR 500</span>
                  </p>
                </div>
                <button type="button" className="clickBtn"><span>새로고침</span></button>
              </div>
            </div>
          </div>
        </div>
      </>
  );
}

export default user_error500;
