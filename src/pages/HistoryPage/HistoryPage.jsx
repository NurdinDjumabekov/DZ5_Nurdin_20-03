/////// hooks
import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

/////// fns
import { getHistoryActionsReq } from "../../store/reducers/virtualMachineSlice";

///////components
import Containers from "../../components/MainPage/Containers/Containers";
import ModalsForContainers from "../../components/MainPage/ModalsForContainers/ModalsForContainers";

/////// imgs
import krestIcon from "../../assets/icons/krest.svg";

////// helpers
import { format } from "date-fns";

///////style
import "./style.scss";

const HistoryPage = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { listHistoryAction } = useSelector(
    (state) => state.virtualMachineSlice
  );

  const [searchText, setSearchText] = useState("");

  const onChangeSearch = (e) => {
    setSearchText(e.target?.value);
  };

  const clearInput = (e) => {
    setSearchText("");
  };

  useEffect(() => {
    const send = {
      elemid: "643164B2-0699-4797-8BAD-207000BFF280",
      vawe: "1",
    };
    dispatch(getHistoryActionsReq(send));
  }, []);

  const formattedTime = format(new Date(), "dd.MM.yyyy HH:mm:ss");
  //   console.log(formattedTime);

  //   console.log(listHistoryAction, "listHistoryAction");

  return (
    <>
      <div className="historyPage">
        <div className="header">
          <div className="searchBigData">
            <input
              type="text"
              placeholder="Поиск"
              value={searchText}
              onChange={onChangeSearch}
            />
            {!!searchText && (
              <button onClick={clearInput}>
                <img src={krestIcon} alt="x" />
              </button>
            )}
          </div>
        </div>
        <div className="body hoverScroll">
          {listHistoryAction?.map((item, index) => (
            <div className="everyHistory">
              <p className="time">{formattedTime}</p>
              <Containers key={index} item={item} />
            </div>
          ))}
        </div>
      </div>
      <ModalsForContainers />
      {/* ///// модалки контейнеров */}
    </>
  );
};

export default HistoryPage;
