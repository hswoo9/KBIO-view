import { Link, NavLink } from "react-router-dom";

function EgovPaging(props) {

  let paginationTag = [];

  if (props.pagination === undefined) {
    paginationTag = "-";
  } else {
    const currentPageNo = props.pagination?.currentPageNo;
    const pageSize = props.pagination?.pageSize;
    const totalRecordCount = props.pagination?.totalRecordCount;
    const recordCountPerPage = props.pagination?.recordCountPerPage;

    const totalPageCount = Math.ceil(totalRecordCount / recordCountPerPage);
    const currentFirstPage =
      Math.floor((currentPageNo - 1) / pageSize) * pageSize + 1;
    let currentLastPage = currentFirstPage + pageSize - 1;
    currentLastPage =
      currentLastPage > totalPageCount ? totalPageCount : currentLastPage;

    if (totalPageCount > pageSize) {
      // 첫 페이지 이동
      const firstPageTag = (
        <li key="fp" className="first arrow">
          <NavLink
            onClick={() => {
              props.moveToPage(1);
            }}
          >
          </NavLink>
        </li>
      );
      paginationTag.push(firstPageTag);

      // 이전 페이지 이동
      const prevPageIndex = currentPageNo - 1 > 0 ? currentPageNo - 1 : 1;
      const previousPageTag = (
        <li key="pp"  className="prev arrow">
          <NavLink
            onClick={() => {
              props.moveToPage(prevPageIndex);
            }}
          >
          </NavLink>
        </li>
      );
      paginationTag.push(previousPageTag);
    }

    for (let i = currentFirstPage; i <= currentLastPage; i++) {
      if (i === currentPageNo) {
        // 현재 페이지
        const currentPage = (
          <li key={i} className="now">
            <NavLink className="cur"><span>{i}</span></NavLink>
          </li>
        );
        paginationTag.push(currentPage);
      } else {
        // 다른 페이지
        const otherPage = (
          <li key={i}>
            <NavLink
              onClick={() => {
                props.moveToPage(i);
              }}
            >
                <span>{i}</span>
            </NavLink>
          </li>
        );
        paginationTag.push(otherPage);
      }
    }
    if (totalPageCount > pageSize) {
      // 다음 페이지 이동
      const nextPageIndex =
        currentLastPage + 1 < totalPageCount
          ? currentLastPage + 1
          : totalPageCount;
      const nextPageTag = (
        <li key="np" className="next arrow active">
          <NavLink
            onClick={() => {
              props.moveToPage(nextPageIndex);
            }}
          >
          </NavLink>
        </li>
      );
      paginationTag.push(nextPageTag);

      // 마지막 페이지 이동
      const lastPageTag = (
        <li key="lp" className="last arrow active">
          <NavLink
            onClick={() => {
              props.moveToPage(totalPageCount);
            }}
          ></NavLink>
        </li>
      );
      paginationTag.push(lastPageTag);
    }
  }
  return (
    <ul className="pageList">{paginationTag}</ul>
  );
}

export default EgovPaging;
