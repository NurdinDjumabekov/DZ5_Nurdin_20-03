import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

//////helpers
import { myAlert } from "../../helpers/MyAlert";

////// imgs
import delIcon from "../../assets/icons/delete.svg";
import editIcon from "../../assets/icons/edit.svg";
import EditIcon from "@mui/icons-material/Edit";

////// components
import ModalsHaProxy from "../../components/HaProxyPage/ModalsHaProxy/ModalsHaProxy";
import { FixedSizeList as List } from "react-window";

/////// fns
import { getHaProxyList } from "../../store/reducers/haProxySlice";
import { setModalActionsHaProxy } from "../../store/reducers/haProxySlice";

////style
import "./style.scss";

const HaProxyPage = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const listRef = useRef(null);
  const [listHeight, setListHeight] = useState(window.innerHeight); // Изначальная высота экрана
  const [activeIndex, setActiveIndex] = useState(0);
  const [counts, setCounts] = useState({});

  const { modalActionsHaProxy } = useSelector((state) => state.haProxySlice);
  const { listHaProxy } = useSelector((state) => state.haProxySlice);

  const getData = async () => {
    const res = await dispatch(getHaProxyList()).unwrap(); /// get список HaProxy
    setCounts(res?.counts);
  };

  useEffect(() => {
    getData();
  }, [pathname]);

  const addProxy = () => {
    const obj = { ...modalActionsHaProxy, typeAction: 1, guid: "create" };
    dispatch(setModalActionsHaProxy(obj));
  };

  const editProxy = async (obj) => {
    const { guid, check, domain, comment, backend_ip } = obj;

    const send = {
      ...modalActionsHaProxy,
      guid,
      name: domain,
      comment,
      checkType: check,
      ip_addres: backend_ip,
      typeAction: 2,
    };
    dispatch(setModalActionsHaProxy(send));
  };

  const delProxy = async ({ guid, domain }) => {
    const send = { guid, name: domain, typeAction: 3 };
    dispatch(setModalActionsHaProxy(send));
  };

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(activeIndex, "center");
    }
  }, [activeIndex]);

  // Обновление высоты при изменении размера окна
  useEffect(() => {
    const handleResize = () => {
      setListHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="haProxy">
      <div className="haProxy__menu">
        <button className="addBtn" onClick={addProxy}>
          +
        </button>
        <div>
          <p>Всего:</p>
          <span>{counts?.all}</span>
        </div>
        <div>
          <p>Вкл:</p>
          <span className="on">{counts?.active}</span>
        </div>
        <div>
          <p>Выкл:</p>
          <span className="off">{counts?.de_active}</span>
        </div>

        <div className="port80">
          <p>80 порт - </p>
          <span></span>
        </div>

        <div className="port80 port443">
          <p>443 порт - </p>
          <span></span>
        </div>
      </div>
      <div className="haProxy__inner">
        {listHaProxy?.map((item, index) => (
          <div className="every" key={index}>
            {item?.map((i, index) => {
              const [ip, port] = i?.backend_ip?.split(":");
              return (
                <div className="every__inner" key={index}>
                  <div
                    className={`btnBlink ${
                      !!i?.ping_status ? "offHaproxy" : "onHaproxy"
                    }`}
                  ></div>
                  <div className="every__inner__data">
                    <div className="action">
                      <div>
                        <p>{i?.domain}</p>
                        <span>{ip}:</span>
                        <span
                          className="port"
                          style={{ color: getCellColor(port) }}
                        >
                          {port}
                        </span>
                      </div>
                      <div>
                        <button className="edit" onClick={() => editProxy(i)}>
                          <EditIcon />
                        </button>
                        <button className="del" onClick={() => delProxy(i)}>
                          <img src={delIcon} alt="delIcon" />
                        </button>
                      </div>
                    </div>
                    <b>{i?.comment || "..."}</b>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <ModalsHaProxy />
      {/* ///// модалки ha-proxy */}
    </div>
  );
};

export default HaProxyPage;

const getCellColor = (port) => {
  if (port === "443") return "#cb3ebd"; // Если порт 443, то красный
  if (port === "80") return "rgb(126, 76, 227)"; // Если порт 80, то зеленый
};
